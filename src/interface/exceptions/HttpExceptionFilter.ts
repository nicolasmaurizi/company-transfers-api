import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { QueryFailedError } from "typeorm";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | undefined = "Internal server error";
    let errors: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (
        exception instanceof BadRequestException &&
        typeof res === "object" &&
        res !== null &&
        Array.isArray((res as any).message)
      ) {
        message = undefined;
        errors = {};

        for (const raw of (res as any).message as string[]) {
          const [field, ...rest] = raw.split(" ");
          const text = rest.join(" ").trim();

          const key = field || "global";
          errors[key] ??= [];
          errors[key].push(text || raw);
        }
      } else {
        message =
          typeof res === "string"
            ? res
            : (res as any).message || (res as any).error || message;
      }
    }

    else if (exception instanceof QueryFailedError) {
      const err: any = exception;

      if (err.code === "23505") {
        status = HttpStatus.CONFLICT;

        const detail = typeof err.detail === "string" ? err.detail : "";
        if (detail.toLowerCase().includes("cuit")) {
          message = "Company with this CUIT already exists.";
        } else {
          message = "Value already exists.";
        }
      } else if (err.code === "23503") {
        status = HttpStatus.NOT_FOUND;
        message = "Related entity not found.";
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = "Database error.";
      }
    }

    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = "Internal server error";
    }

    const logMsg = errors ? JSON.stringify(errors) : message;
    this.logger.error(`[${request.method}] ${request.url} -> ${logMsg}`);

    const payload: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    if (errors) payload.errors = errors;
    else payload.message = message;

    response.status(status).json(payload);
  }
}

import * as dotenv from "dotenv";
dotenv.config();
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import "reflect-metadata";
import { HttpExceptionFilter } from "../src/interface/exceptions/HttpExceptionFilter";

/**
 * Inicializa la aplicación NestJS.
 * - Configura filtros globales de excepciones.
 * - Configura pipes de validación globales.
 * - Habilita CORS.
 * - Escucha en el puerto definido por la variable de entorno PORT o 3000.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
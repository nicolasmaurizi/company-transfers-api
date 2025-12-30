import { Inject } from '@nestjs/common';
import { CompanyRepository } from '../../domain/repositories/CompanyRepository';
import { CreateCompanyDTO } from '../dtos/CreateCompanyDTO';
import { Company } from '../../domain/entities/Company';
import { v4 as uuid } from 'uuid';

/**
 * Caso de uso para crear una nueva empresa.
 */
export class CreateCompany {
  /**
   * @param repo Repositorio de empresas inyectado
   */
  constructor(
    @Inject('CompanyRepository')
    private readonly repo: CompanyRepository,
  ) {}

  /**
   * Ejecuta la creación de una empresa.
   * @param dto Datos para crear la empresa
   * @returns Promise<void>
   */
  async execute(dto: CreateCompanyDTO): Promise<void> {
    const company = new Company(
      uuid(),
      dto.name,
      dto.cuit,
      dto.type,
      new Date(),
      dto.lastTransferAt,
    );
    await this.repo.create(company);
  }
}
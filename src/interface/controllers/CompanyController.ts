import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateCompany } from '../../application/use-cases/CreateCompany';
import { CreateCompanyDTO } from '../../application/dtos/CreateCompanyDTO';
import { FindCompaniesByTransferLastMonth } from '../../application/use-cases/FindCompaniesByTransferLastMonth';
import { FindCompaniesByAdhesionLastMonth } from '../../application/use-cases/FindCompaniesByAdhesionLastMonth';
import { CompanyResponseDTO } from '../dtos/CompanyResponseDTO';

@Controller('companies')
export class CompanyController {
  constructor(
    private readonly createCU: CreateCompany,
    private readonly transferCU: FindCompaniesByTransferLastMonth,
    private readonly adhesionCU: FindCompaniesByAdhesionLastMonth,
  ) {}

  @Post()
  async create(@Body() dto: CreateCompanyDTO) {
    await this.createCU.execute(dto);
    return { message: 'Empresa creada' };
  }

  @Get('/transfers-last-month')
  async transferred() {
    const companies = await this.transferCU.execute();
    return companies.map(c => new CompanyResponseDTO(c));
  }

  @Get('/adhesions-last-month')
  async adhered() {
    const companies = await this.adhesionCU.execute();
    return companies.map(c => new CompanyResponseDTO(c));
  }
}
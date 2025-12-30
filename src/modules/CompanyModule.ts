import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from '../config/ormconfig';
import { CompanyController } from '../interface/controllers/CompanyController';
import { TypeORMCompanyRepository } from '../infrastructure/typeorm/repositories/TypeORMCompanyRepository';
import { CompanyEntity } from '../infrastructure/typeorm/entities/CompanyEntity';
import { CreateCompany } from '../application/use-cases/CreateCompany';
import { FindCompaniesByTransferLastMonth } from '../application/use-cases/FindCompaniesByTransferLastMonth';
import { FindCompaniesByAdhesionLastMonth } from '../application/use-cases/FindCompaniesByAdhesionLastMonth';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), TypeOrmModule.forFeature([CompanyEntity])],
  controllers: [CompanyController],
  providers: [
    { provide: 'CompanyRepository', useClass: TypeORMCompanyRepository },
    CreateCompany,
    FindCompaniesByTransferLastMonth,
    FindCompaniesByAdhesionLastMonth,
  ],
    exports: ['CompanyRepository'],
})
export class CompanyModule {}
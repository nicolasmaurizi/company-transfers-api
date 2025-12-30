import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CompanyEntity } from '../infrastructure/typeorm/entities/CompanyEntity';
import { BankTransferEntity } from '../infrastructure/typeorm/entities/BankTransferEntity';
export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [CompanyEntity,BankTransferEntity],
  synchronize: true,
};

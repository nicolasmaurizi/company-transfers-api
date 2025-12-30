import { Module } from '@nestjs/common';
import { CompanyModule } from './modules/CompanyModule';
import { BankTransferModule } from './modules/BankTransferModule';

@Module({
  imports: [CompanyModule, BankTransferModule],
})
export class AppModule {}

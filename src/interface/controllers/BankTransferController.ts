import { Controller, Post, Body } from '@nestjs/common';
import { CreateBankTransfer } from '../../application/use-cases/CreateBankTransfer';
import { CreateBankTransferDTO } from '../../application/dtos/CreateBankTransferDTO';

@Controller('bank-transfers')
export class BankTransferController {
  constructor(private readonly createCU: CreateBankTransfer) {}

  @Post()
  async create(@Body() dto: CreateBankTransferDTO) {
    await this.createCU.execute(dto);
    return { message: 'Transferencia registrada' };
  }
}


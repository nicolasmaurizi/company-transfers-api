import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BankTransferEntity } from "../infrastructure/typeorm/entities/BankTransferEntity";
import { BankTransferController } from "../interface/controllers/BankTransferController";
import { TypeORMBankTransferRepository } from "../infrastructure/typeorm/repositories/TypeORMBankTransferRepository";
import { CreateBankTransfer } from "../application/use-cases/CreateBankTransfer";
import { CompanyModule } from "./CompanyModule";

@Module({
	imports: [CompanyModule, TypeOrmModule.forFeature([BankTransferEntity])],
	controllers: [BankTransferController],
	providers: [
		{
			provide: "BankTransferRepository",
			useClass: TypeORMBankTransferRepository,
		},
		{
			provide: CreateBankTransfer,
			useClass: CreateBankTransfer,
		},
	],
})
export class BankTransferModule {}

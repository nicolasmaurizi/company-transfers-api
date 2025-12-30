import { BankTransferRepository } from "../../domain/repositories/BankTransferRepository";
import { CreateBankTransferDTO } from "../dtos/CreateBankTransferDTO";
import { BankTransfer } from "../../domain/entities/BankTransfer";
import { CompanyRepository } from "../../domain/repositories/CompanyRepository";
import { v4 as uuid } from "uuid";
import { CompanyNotFoundError } from "../errors/CompanyNotFoundError";
import { UnitOfWork } from "../../domain/ports/UnitOfWork";
/**
 * Caso de uso para registrar una transferencia bancaria.
 */
export class CreateBankTransfer {
	/**
	 * @param repo Repositorio de transferencias bancarias inyectado
	 * @param companyRepo Repositorio de empresas inyectado
	 */
	constructor(
		private readonly repo: BankTransferRepository,
		private readonly companyRepo: CompanyRepository,
		private readonly uow: UnitOfWork
	) {}

	/**
	 * Ejecuta el registro de una transferencia bancaria.
	 * @param dto Datos de la transferencia
	 * @throws Error si la empresa no existe
	 * @returns Promise<void>
	 */
	async execute(dto: CreateBankTransferDTO): Promise<void> {
		const movementDate = new Date(dto.movementDate);
		if (Number.isNaN(movementDate.getTime())) {
			throw new Error("Invalid movementDate");
		}
		await this.uow.runInTransaction(async (tx) => {
			const company = await this.companyRepo.findById(dto.companyId, tx);
			if (!company) throw new Error("Company not found");

			const transfer = new BankTransfer(
				uuid(),
				dto.companyId,
				dto.debitAccount,
				dto.creditAccount,
				dto.amount,
				movementDate
			);

			await this.repo.create(transfer, tx);
			await this.companyRepo.updateLastTransferAt(dto.companyId, movementDate, tx);
		});
	}
}

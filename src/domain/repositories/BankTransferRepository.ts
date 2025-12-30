import { BankTransfer } from '../entities/BankTransfer';

export interface BankTransferRepository {
  create(transfer: BankTransfer, tx?: unknown): Promise<void>;
  findByCompany(companyId: string, tx?: unknown): Promise<BankTransfer[]>;
}
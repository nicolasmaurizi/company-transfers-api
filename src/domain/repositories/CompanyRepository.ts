import { Company } from '../entities/Company';

export interface CompanyRepository {
  create(company: Company, tx?: unknown): Promise<void>;
  findTransferredSince(date: Date, tx?: unknown): Promise<Company[]>;
  findCreatedSince(date: Date, tx?: unknown): Promise<Company[]>;
  updateLastTransferAt(companyId: string, date: Date, tx?: unknown): Promise<void>;
  findById(id: string, tx?: unknown): Promise<Company | null>;
}
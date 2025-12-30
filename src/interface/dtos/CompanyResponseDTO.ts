import { Company } from '../../domain/entities/Company';

export class CompanyResponseDTO {
  id: string;
  name: string;
  cuit: string;
  type: string;
  createdAt: Date;
  lastTransferAt?: Date;

  constructor(c: Company) {
    this.id = c.id;
    this.name = c.name;
    this.cuit = c.cuit;
    this.type = c.type;
    this.createdAt = c.createdAt;
    this.lastTransferAt = c.lastTransferAt;
  }
}
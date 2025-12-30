import { CompanyType } from '../value-objects/CompanyType';

export class Company {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly cuit: string,
    public readonly type: CompanyType,
    public readonly createdAt: Date,
    public readonly lastTransferAt?: Date,
  ) {}
}

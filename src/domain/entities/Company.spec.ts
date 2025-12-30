import { Company } from './Company';
import { CompanyType } from '../value-objects/CompanyType';

describe('Company', () => {
  it('should create a company with required fields', () => {
    const createdAt = new Date();
    const company = new Company(
      '1',
      'Test Co',
      '20123456789',
      CompanyType.PYME,
      createdAt
    );

    expect(company.id).toBe('1');
    expect(company.name).toBe('Test Co');
    expect(company.cuit).toBe('20123456789');
    expect(company.type).toBe(CompanyType.PYME);
    expect(company.createdAt).toBe(createdAt);
    expect(company.lastTransferAt).toBeUndefined();
  });

  it('should create a company with lastTransferAt if provided', () => {
    const createdAt = new Date();
    const lastTransfer = new Date();
    const company = new Company(
      '2',
      'Test Co 2',
      '20987654321',
      CompanyType.CORPORATIVA,
      createdAt,
      lastTransfer
    );

    expect(company.lastTransferAt).toBe(lastTransfer);
  });
});

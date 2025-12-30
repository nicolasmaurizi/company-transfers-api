import { CompanyType } from './CompanyType';

describe('CompanyType', () => {
  it('should include known types', () => {
    expect(CompanyType.PYME).toBe('PYME');
    expect(CompanyType.CORPORATIVA).toBe('CORPORATIVA');
  });
});
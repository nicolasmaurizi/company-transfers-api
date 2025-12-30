import { FindCompaniesByTransferLastMonth } from './FindCompaniesByTransferLastMonth';
import { Company } from '../../domain/entities/Company';
import { CompanyType } from '../../domain/value-objects/CompanyType';

describe('FindCompaniesByTransferLastMonth', () => {
  let useCase: FindCompaniesByTransferLastMonth;
  let companyRepo: any;

  beforeEach(() => {
    companyRepo = { findTransferredSince: jest.fn() };
    useCase = new FindCompaniesByTransferLastMonth(companyRepo);
  });

  it('should return companies transferred in the last month', async () => {
    const fixedDate = new Date('2025-07-23T00:00:00Z');
    jest.spyOn(Date, 'now').mockReturnValue(fixedDate.getTime());

    const companies: Company[] = [
      new Company('1', 'Test Co', '20123456789', CompanyType.PYME, fixedDate, new Date()),
    ];
    companyRepo.findTransferredSince.mockResolvedValue(companies);

    const result = await useCase.execute();

    expect(result).toEqual(companies);

    jest.restoreAllMocks();
  });

  it('should handle empty results', async () => {
    const fixedDate = new Date('2025-07-23T00:00:00Z');
    jest.spyOn(Date, 'now').mockReturnValue(fixedDate.getTime());

    companyRepo.findTransferredSince.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);

    jest.restoreAllMocks();
  });
});

import { CreateCompany } from './CreateCompany';
import { CompanyType } from '../../domain/value-objects/CompanyType';

describe('CreateCompany', () => {
  let useCase: CreateCompany;
  let companyRepo: any;

  beforeEach(() => {
    companyRepo = { create: jest.fn() };
    useCase = new CreateCompany(companyRepo);
  });

  it('should create a company with valid data', async () => {
    const dto = { name: 'Test Company', type: CompanyType.PYME, cuit: '20123456789' };
    await useCase.execute(dto);
    expect(companyRepo.create).toHaveBeenCalledWith(expect.objectContaining({
      name: dto.name,
      type: dto.type,
      cuit: dto.cuit
    }));
  });

  it('should throw if name is missing', async () => {
    const dto = { name: '', type: CompanyType.PYME, cuit: '20123456789' };
    companyRepo.create.mockImplementation(() => { throw new Error('Invalid company data'); });
    await expect(useCase.execute(dto)).rejects.toThrow('Invalid company data');
  });
});

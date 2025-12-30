import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './CompanyController';
import { CreateCompany } from '../../application/use-cases/CreateCompany';
import { FindCompaniesByTransferLastMonth } from '../../application/use-cases/FindCompaniesByTransferLastMonth';
import { FindCompaniesByAdhesionLastMonth } from '../../application/use-cases/FindCompaniesByAdhesionLastMonth';
import { CreateCompanyDTO } from '../../application/dtos/CreateCompanyDTO';
import { Company } from '../../domain/entities/Company';
import { CompanyType } from '../../domain/value-objects/CompanyType';
import { CompanyResponseDTO } from '../dtos/CompanyResponseDTO';

describe('CompanyController', () => {
  let controller: CompanyController;
  let createCU: CreateCompany;
  let transferCU: FindCompaniesByTransferLastMonth;
  let adhesionCU: FindCompaniesByAdhesionLastMonth;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CreateCompany,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindCompaniesByTransferLastMonth,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindCompaniesByAdhesionLastMonth,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    createCU = module.get(CreateCompany);
    transferCU = module.get(FindCompaniesByTransferLastMonth);
    adhesionCU = module.get(FindCompaniesByAdhesionLastMonth);
  });

  it('should call CreateCompany use case and return message', async () => {
    const dto: CreateCompanyDTO = {
      name: 'Test Co',
      cuit: '20123456789',
      type: CompanyType.PYME,
    };

    await expect(controller.create(dto)).resolves.toEqual({ message: 'Empresa creada' });
    expect(createCU.execute).toHaveBeenCalledWith(dto);
  });

  it('should return companies transferred last month as DTOs', async () => {
    const company = new Company(
      '1',
      'Test Co',
      '20123456789',
      CompanyType.PYME,
      new Date(),
      new Date()
    );
    (transferCU.execute as jest.Mock).mockResolvedValue([company]);

    const result = await controller.transferred();

    expect(result).toEqual([new CompanyResponseDTO(company)]);
    expect(transferCU.execute).toHaveBeenCalled();
  });

  it('should return companies adhered last month as DTOs', async () => {
    const company = new Company(
      '2',
      'Other Co',
      '20987654321',
      CompanyType.CORPORATIVA,
      new Date()
    );
    (adhesionCU.execute as jest.Mock).mockResolvedValue([company]);

    const result = await controller.adhered();

    expect(result).toEqual([new CompanyResponseDTO(company)]);
    expect(adhesionCU.execute).toHaveBeenCalled();
  });
});

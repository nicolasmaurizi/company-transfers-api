import { TypeORMBankTransferRepository } from './TypeORMBankTransferRepository';
import { Repository } from 'typeorm';
import { BankTransferEntity } from '../entities/BankTransferEntity';
import { BankTransfer } from '../../../domain/entities/BankTransfer';

describe('TypeORMBankTransferRepository', () => {
  let repo: Repository<BankTransferEntity>;
  let bankTransferRepo: TypeORMBankTransferRepository;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    } as any;

    bankTransferRepo = new TypeORMBankTransferRepository(repo);
  });

  describe('create', () => {
    it('should call repo.create and repo.save with correct values', async () => {
      const transfer = new BankTransfer(
        't1',
        'c1',
        'DEB123',
        'CRE456',
        1000,
        new Date('2025-07-23T00:00:00Z')
      );

      const mockEntity = { id: 't1' } as BankTransferEntity;
      (repo.create as jest.Mock).mockReturnValue(mockEntity);

      await bankTransferRepo.create(transfer);

      expect(repo.create).toHaveBeenCalledWith({
        id: transfer.id,
        company: { id: transfer.companyId },
        debitAccount: transfer.debitAccount,
        creditAccount: transfer.creditAccount,
        amount: transfer.amount,
        movementDate: transfer.movementDate,
      });
      expect(repo.save).toHaveBeenCalledWith(mockEntity);
    });
  });

  describe('findByCompany', () => {
    it('should return mapped BankTransfer array', async () => {
      const companyId = 'c1';
      const entity: BankTransferEntity = {
        id: 't1',
        company: { id: companyId } as any,
        debitAccount: 'DEB123',
        creditAccount: 'CRE456',
        amount: 1500,
        movementDate: new Date('2025-07-23T00:00:00Z'),
      };

      (repo.find as jest.Mock).mockResolvedValue([entity]);

      const result = await bankTransferRepo.findByCompany(companyId);

      expect(repo.find).toHaveBeenCalledWith({
        where: { company: { id: companyId } },
        relations: ['company'],
      });

      expect(result).toEqual([
        new BankTransfer(
          entity.id,
          companyId,
          entity.debitAccount,
          entity.creditAccount,
          entity.amount,
          entity.movementDate
        ),
      ]);
    });

    it('should throw error if repo.find fails', async () => {
      const companyId = 'c1';
      (repo.find as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(bankTransferRepo.findByCompany(companyId)).rejects.toThrow(
        `Error fetching bank transfers for company ${companyId}`
      );
    });
  });
});

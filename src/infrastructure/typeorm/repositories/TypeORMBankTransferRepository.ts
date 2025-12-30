import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from "typeorm";
import { BankTransfer } from '../../../domain/entities/BankTransfer';
import { BankTransferEntity } from '../entities/BankTransferEntity';
import { BankTransferRepository } from '../../../domain/repositories/BankTransferRepository';

/**
 * Implementación de repositorio de transferencias bancarias usando TypeORM.
 */
@Injectable()
export class TypeORMBankTransferRepository implements BankTransferRepository {
  /**
   * @param repo Repositorio TypeORM de la entidad BankTransferEntity
   */
  constructor(
    @InjectRepository(BankTransferEntity)
    private readonly repo: Repository<BankTransferEntity>,
  ) {}

    private getRepo(tx?: unknown): Repository<BankTransferEntity> {
    if (!tx) return this.repo;
    const manager = tx as EntityManager;
    return manager.getRepository(BankTransferEntity);
  }

  /**
   * Guarda una transferencia bancaria en la base de datos.
   * @param transfer Transferencia a guardar
   * @returns Promise<void>
   */
  async create(transfer: BankTransfer, tx?: unknown): Promise<void> {
    const repo = this.getRepo(tx);
    const entity = repo.create({
      id: transfer.id,
      company: { id: transfer.companyId } as any, 
      debitAccount: transfer.debitAccount,
      creditAccount: transfer.creditAccount,
      amount: transfer.amount,
      movementDate: transfer.movementDate,
    });
    await this.repo.save(entity);
  }

  /**
   * Busca transferencias por empresa.
   * @param companyId ID de la empresa
   * @returns Array de transferencias bancarias
   */
  async findByCompany(companyId: string, tx?: unknown): Promise<BankTransfer[]> {
    try {
      const repo = this.getRepo(tx);
      const ents = await this.repo.find({
        where: { company: { id: companyId } },
        relations: ['company'],
      });
      return ents.map(e => new BankTransfer(e.id, e.company.id, e.debitAccount, e.creditAccount, e.amount, e.movementDate));
    } catch (error) {
      console.error(error);
      throw new Error(`Error fetching bank transfers for company ${companyId}`);
    }
  }
}
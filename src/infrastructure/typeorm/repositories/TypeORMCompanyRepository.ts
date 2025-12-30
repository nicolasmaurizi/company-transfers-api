import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager,Repository } from "typeorm";
import { CompanyEntity } from "../entities/CompanyEntity";
import { Company } from "../../../domain/entities/Company";
import { CompanyRepository } from "../../../domain/repositories/CompanyRepository";
import { MoreThanOrEqual } from "typeorm";
import { ConflictException } from "@nestjs/common";
/**
 * Implementación de repositorio de empresas usando TypeORM.
 */
@Injectable()
export class TypeORMCompanyRepository implements CompanyRepository {
	/**
	 * @param repo Repositorio TypeORM de la entidad CompanyEntity
	 */
	constructor(
		@InjectRepository(CompanyEntity)
		private readonly repo: Repository<CompanyEntity>
	) {}

	private getRepo(tx?: unknown): Repository<CompanyEntity> {
  if (!tx) return this.repo;
  const manager = tx as EntityManager;
  return manager.getRepository(CompanyEntity);
}

	/**
	 * Guarda una empresa en la base de datos.
	 * @param company Empresa a guardar
	 * @returns Promise<void>
	 */
	async create(company: Company, tx?: unknown): Promise<void> {
		try {
			const repo = this.getRepo(tx);
			const entity = repo.create({
				id: company.id,
				name: company.name,
				cuit: company.cuit,
				type: company.type,
				createdAt: company.createdAt,
				lastTransferAt: company.lastTransferAt,
			});
			await this.repo.save(entity);
		} catch (error) {
			if (
				typeof error === "object" &&
				error !== null &&
				"code" in error &&
				(error as any).code === "23505"
			) {
				throw new ConflictException("Company with this CUIT already exists.");
			}
			throw error;
		}
	}

	/**
	 * Busca una empresa por su ID.
	 * @param id ID de la empresa
	 * @returns Empresa encontrada o null
	 */
	async findById(id: string, tx?: unknown): Promise<Company | null> {
		const repo = this.getRepo(tx);
		const entity = await repo.findOne({ where: { id } });
		if (!entity) return null;
		return new Company(
			entity.id,
			entity.name,
			entity.cuit,
			entity.type,
			entity.createdAt,
			entity.lastTransferAt
		);
	}
	/**
	 * Busca empresas que realizaron transferencias desde una fecha dada.
	 * @param date Fecha de inicio
	 * @returns Array de empresas
	 */
	async findTransferredSince(date: Date, tx?: unknown): Promise<Company[]> {
		const repo = this.getRepo(tx);
		const ents = await repo.find({
			where: { lastTransferAt: MoreThanOrEqual(date) },
		});
		return ents.map(
			(e) =>
				new Company(e.id, e.name, e.cuit, e.type, e.createdAt, e.lastTransferAt)
		);
	}
	/**
	 * Busca empresas creadas desde una fecha dada.
	 * @param date Fecha de inicio
	 * @returns Array de empresas
	 */
	async findCreatedSince(date: Date, tx?: unknown): Promise<Company[]> {
		const repo = this.getRepo(tx);
		const ents = await repo.find({
			where: { createdAt: MoreThanOrEqual(date) },
		});
		return ents.map(
			(e) =>
				new Company(e.id, e.name, e.cuit, e.type, e.createdAt, e.lastTransferAt)
		);
	}

	/**
	 * Actualiza la fecha de la última transferencia de una empresa.
	 * @param id ID de la empresa
	 * @param date Fecha de la última transferencia
	 * @returns Promise<void>
	 */
	async updateLastTransferAt(id: string, date: Date, tx?: unknown): Promise<void> {
		const repo = this.getRepo(tx);
		await repo.update(id, { lastTransferAt: date });
	}
}

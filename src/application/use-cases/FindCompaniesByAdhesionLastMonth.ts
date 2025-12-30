import { Inject } from "@nestjs/common";
import { CompanyRepository } from "../../domain/repositories/CompanyRepository";
import { Company } from "../../domain/entities/Company";

export class FindCompaniesByAdhesionLastMonth {
	constructor(
		@Inject("CompanyRepository")
		private readonly repo: CompanyRepository
	) {}

	async execute(): Promise<Company[]> {
		const nowUtc = new Date();
		const lastMonthUtc = new Date(nowUtc.getTime() - 30 * 24 * 60 * 60 * 1000);
		return this.repo.findCreatedSince(lastMonthUtc);
	}
}

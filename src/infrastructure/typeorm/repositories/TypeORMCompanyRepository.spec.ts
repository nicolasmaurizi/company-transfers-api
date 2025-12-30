import { TypeORMCompanyRepository } from "./TypeORMCompanyRepository";
import { Repository } from "typeorm";
import { CompanyEntity } from "../entities/CompanyEntity";
import { Company } from "../../../domain/entities/Company";
import { CompanyType } from "../../../domain/value-objects/CompanyType";

describe("TypeORMCompanyRepository", () => {
	let ormRepo: Repository<CompanyEntity>;
	let companyRepo: TypeORMCompanyRepository;

	beforeEach(() => {
		ormRepo = {
			create: jest.fn().mockImplementation((data) => data),
			save: jest.fn(),
			find: jest.fn(),
			update: jest.fn(),
			findOne: jest.fn(),
		} as any;

		companyRepo = new TypeORMCompanyRepository(ormRepo);
	});

	it("should save company", async () => {
		const company = new Company(
			"1",
			"Empresa S.A.",
			"20304050607",
			CompanyType.PYME,
			new Date(),
			new Date()
		);

		await companyRepo.create(company);

		expect(ormRepo.save).toHaveBeenCalledWith(
			expect.objectContaining({
				id: company.id,
				name: company.name,
				cuit: company.cuit,
			})
		);
	});

	it("should find companies by lastTransferAt", async () => {
		const fakeDate = new Date();
		const entities: CompanyEntity[] = [
			{
				id: "1",
				name: "Emp 1",
				cuit: "20123456789",
				type: CompanyType.PYME,
				createdAt: fakeDate,
				lastTransferAt: fakeDate,
			},
		];

		(ormRepo.find as jest.Mock).mockResolvedValue(entities);

		const result = await companyRepo.findTransferredSince(fakeDate);

		expect(ormRepo.find).toHaveBeenCalledWith({
			where: { lastTransferAt: expect.anything() },
		});

		expect(result[0]).toBeInstanceOf(Company);
		expect(result[0].id).toBe("1");
	});

	it("should find companies by createdAt", async () => {
		const fakeDate = new Date();
		const entities: CompanyEntity[] = [
			{
				id: "2",
				name: "Emp 2",
				cuit: "20987654321",
				type: CompanyType.CORPORATIVA,
				createdAt: fakeDate,
				lastTransferAt: new Date(),
			},
		];

		(ormRepo.find as jest.Mock).mockResolvedValue(entities);

		const result = await companyRepo.findCreatedSince(fakeDate);

		expect(ormRepo.find).toHaveBeenCalledWith({
			where: { createdAt: expect.anything() },
		});

		expect(result[0]).toBeInstanceOf(Company);
		expect(result[0].id).toBe("2");
	});

	it("should update lastTransferAt", async () => {
		const companyId = "1";
		const date = new Date();

		await companyRepo.updateLastTransferAt(companyId, date);

		expect(ormRepo.update).toHaveBeenCalledWith(companyId, {
			lastTransferAt: date,
		});
	});

	it("should find company by id", async () => {
		const entity = {
			id: "1",
			name: "Empresa",
			cuit: "20123456789",
			type: CompanyType.PYME,
			createdAt: new Date(),
			lastTransferAt: new Date(),
		};

		(ormRepo.findOne as jest.Mock).mockResolvedValue(entity);

		const result = await companyRepo.findById("1");

		expect(ormRepo.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
		expect(result).toEqual(entity);
	});
});

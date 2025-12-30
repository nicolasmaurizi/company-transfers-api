import { FindCompaniesByAdhesionLastMonth } from "./FindCompaniesByAdhesionLastMonth";
import { Company } from "../../domain/entities/Company";
import { CompanyType } from "../../domain/value-objects/CompanyType";

describe("FindCompaniesByAdhesionLastMonth", () => {
	let useCase: FindCompaniesByAdhesionLastMonth;
	let companyRepo: any;

	beforeEach(() => {
		companyRepo = { findCreatedSince: jest.fn() };
		useCase = new FindCompaniesByAdhesionLastMonth(companyRepo);
	});
/*
it("should call repository with date 30 days ago", async () => {
  const fixedDate = new Date("2025-07-23T00:00:00Z");
  jest.spyOn(Date, "now").mockReturnValue(fixedDate.getTime());

  const companies: Company[] = [
    {
      id: "1",
      name: "Test Co",
      type: CompanyType.PYME,
      cuit: "20123456789",
      createdAt: fixedDate,
    },
  ];
  companyRepo.findCreatedSince.mockResolvedValue(companies);

  const result = await useCase.execute();

  const date30DaysAgo = new Date(fixedDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  const expectedDate = new Date(Date.UTC(
    date30DaysAgo.getUTCFullYear(),
    date30DaysAgo.getUTCMonth(),
    date30DaysAgo.getUTCDate()
  ));

  const calledDate = companyRepo.findCreatedSince.mock.calls[0][0];
  expect(calledDate.getTime()).toEqual(expectedDate.getTime());

  expect(result).toEqual(companies);

  jest.restoreAllMocks();
});
*/
    it("should return companies created in the last month", async () => {
        const fixedDate = new Date("2025-07-23T00:00:00Z");
        jest.spyOn(Date, "now").mockReturnValue(fixedDate.getTime());

        const companies: Company[] = [
            new Company("1", "Test Co", "20123456789", CompanyType.PYME, fixedDate, new Date()),
        ];
        companyRepo.findCreatedSince.mockResolvedValue(companies);

        const result = await useCase.execute();

        expect(result).toEqual(companies);
    });

    it("should handle empty results from repository", async () => {
        const fixedDate = new Date("2025-07-23T00:00:00Z");
        jest.spyOn(Date, "now").mockReturnValue(fixedDate.getTime());

        companyRepo.findCreatedSince.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(result).toEqual([]);
    });


});

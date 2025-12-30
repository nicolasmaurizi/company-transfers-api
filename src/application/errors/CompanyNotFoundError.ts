export class CompanyNotFoundError extends Error {
  constructor(companyId: string) {
    super(`Company not found: ${companyId}`);
    this.name = "CompanyNotFoundError";
  }
}

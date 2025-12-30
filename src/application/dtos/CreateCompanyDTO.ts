import { IsString, IsEnum, IsOptional, Matches,IsNotEmpty } from "class-validator";
import { CompanyType } from "../../domain/value-objects/CompanyType";

export class CreateCompanyDTO {
	@IsString() @IsNotEmpty() name!: string;
	@IsString()
	@Matches(/^\d{11}$/, { message: "CUIT must have exactly 11 digits" })
	cuit!: string;
	@IsEnum(CompanyType) type!: CompanyType;
	@IsOptional() lastTransferAt?: Date;
}

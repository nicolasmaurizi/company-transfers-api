import { IsUUID, IsString, IsNumber, Matches, Length, Min } from "class-validator";

export class CreateBankTransferDTO {
	@IsUUID() companyId!: string;
	@IsString()
	@Length(22, 22, { message: "The CBU must be exactly 22 digits long." })
	@Matches(/^[0-9]{22}$/, {
		message: "The CBU must contain only numeric characters.",
	})
	debitAccount!: string;
	@IsString()
	@Length(22, 22, { message: "The CBU must be exactly 22 digits long." })
	@Matches(/^[0-9]{22}$/, {
		message: "The CBU must contain only numeric characters.",
	})
	creditAccount!: string;
	@IsNumber() @Min(0.01, { message: 'Amount must be greater than zero.' })
  amount!: number;
	@IsString() movementDate!: string;
}

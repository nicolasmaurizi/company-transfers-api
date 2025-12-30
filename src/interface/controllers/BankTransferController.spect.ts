import { Test, TestingModule } from "@nestjs/testing";
import { BankTransferController } from "./BankTransferController";
import { CreateBankTransfer } from "../../application/use-cases/CreateBankTransfer";
import { CreateBankTransferDTO } from "../../application/dtos/CreateBankTransferDTO";

describe("BankTransferController", () => {
	let controller: BankTransferController;
	let createCU: CreateBankTransfer;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BankTransferController],
			providers: [
				{
					provide: CreateBankTransfer,
					useValue: { execute: jest.fn() },
				},
			],
		}).compile();

		controller = module.get<BankTransferController>(BankTransferController);
		createCU = module.get<CreateBankTransfer>(CreateBankTransfer);
	});

	it("should call CreateBankTransfer use case and return message", async () => {
		const dto: CreateBankTransferDTO = {
			companyId: "c1",
			debitAccount: "DEB123",
			creditAccount: "CRE456",
			amount: 1000,
			movementDate: "2025-07-23T00:00:00.000Z",
		};

		const result = await controller.create(dto);

		expect(createCU.execute).toHaveBeenCalledWith(dto);
		expect(result).toEqual({ message: "Transferencia registrada" });
	});
});

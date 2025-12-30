import { CreateBankTransfer } from "./CreateBankTransfer";

describe("CreateBankTransfer", () => {
  let useCase: CreateBankTransfer;
  let bankTransferRepo: any;
  let companyRepo: any;
  let uow: any;

  beforeEach(() => {
    bankTransferRepo = { create: jest.fn() };
    companyRepo = {
      findById: jest.fn().mockResolvedValue({ id: "uuid" }),
      updateLastTransferAt: jest.fn(),
    };
    uow = {
      runInTransaction: jest.fn(async (work: any) => work(undefined)),
    };

    useCase = new CreateBankTransfer(bankTransferRepo, companyRepo, uow);
  });

  it("should throw if company does not exist", async () => {
    useCase = new CreateBankTransfer(
      bankTransferRepo,
      {
        ...companyRepo,
        findById: jest.fn().mockResolvedValue(null),
      },
      uow
    );

    await expect(
      useCase.execute({
        companyId: "invalid",
        debitAccount: "123",
        creditAccount: "321",
        amount: 100,
        movementDate: new Date().toISOString(),
      })
    ).rejects.toThrow(Error);

    expect(uow.runInTransaction).toHaveBeenCalledTimes(1);
  });

  it("should create transfer and update company", async () => {
    await useCase.execute({
      companyId: "uuid",
      debitAccount: "123",
      creditAccount: "321",
      amount: 100,
      movementDate: new Date().toISOString(),
    });

    expect(uow.runInTransaction).toHaveBeenCalledTimes(1);
    expect(bankTransferRepo.create).toHaveBeenCalled();
    expect(companyRepo.updateLastTransferAt).toHaveBeenCalled();
  });
});

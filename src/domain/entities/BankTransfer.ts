export class BankTransfer {
	constructor(
		public readonly id: string,
		public readonly companyId: string,
		public readonly debitAccount: string,
		public readonly creditAccount: string,
		public readonly amount: number,
		public readonly movementDate: Date
	) {}
}

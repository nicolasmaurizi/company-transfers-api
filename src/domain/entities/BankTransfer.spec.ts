import { BankTransfer } from './BankTransfer';

describe('BankTransfer', () => {
  it('should create a bank transfer with all required fields', () => {
    const date = new Date();
    const transfer = new BankTransfer(
      't1',
      'c1',
      'DEBIT123',
      'CREDIT456',
      1000,
      date
    );

    expect(transfer.id).toBe('t1');
    expect(transfer.companyId).toBe('c1');
    expect(transfer.debitAccount).toBe('DEBIT123');
    expect(transfer.creditAccount).toBe('CREDIT456');
    expect(transfer.amount).toBe(1000);
    expect(transfer.movementDate).toBe(date);
  });
});

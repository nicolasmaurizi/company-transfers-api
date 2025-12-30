export interface TxContext {} 

export interface UnitOfWork {
  runInTransaction<T>(work: (tx: TxContext) => Promise<T>): Promise<T>;
}

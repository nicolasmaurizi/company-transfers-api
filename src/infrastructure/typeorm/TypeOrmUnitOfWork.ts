import { DataSource, EntityManager } from "typeorm";
import { UnitOfWork } from "../../domain/ports/UnitOfWork";

export class TypeOrmUnitOfWork implements UnitOfWork {
  constructor(private readonly dataSource: DataSource) {}

  async runInTransaction<T>(
    work: (manager: EntityManager) => Promise<T>
  ): Promise<T> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      return work(manager);
    });
  }
}

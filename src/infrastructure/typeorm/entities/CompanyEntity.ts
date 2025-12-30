import { Entity, PrimaryColumn, Column,PrimaryGeneratedColumn, Unique } from 'typeorm';
import { CompanyType } from '../../../domain/value-objects/CompanyType';

@Entity('companies')
export class CompanyEntity {
  @PrimaryColumn('uuid') id!: string;
  @Column({ unique: true }) name!: string;
  @Column({ unique: true }) cuit!: string;
  @Column({ type: 'enum', enum: CompanyType }) type!: CompanyType;
  @Column({ type: 'timestamptz' }) createdAt!: Date;
  @Column({ type: 'timestamptz', nullable: true }) lastTransferAt?: Date;
}
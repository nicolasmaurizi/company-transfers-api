import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { CompanyEntity } from "./CompanyEntity";

@Entity("bank_transfers")
export class BankTransferEntity {
	@PrimaryColumn("uuid") id!: string;
	@ManyToOne(() => CompanyEntity, { nullable: false })
	@JoinColumn({ name: "companyId" })
	company!: CompanyEntity;
	@Column() debitAccount!: string;
	@Column() creditAccount!: string;
	@Column("numeric") amount!: number;
	@Column({ type: "timestamptz" }) movementDate!: Date;
}

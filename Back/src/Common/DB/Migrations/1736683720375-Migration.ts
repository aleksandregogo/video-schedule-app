import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1736683720375 implements MigrationInterface {
    name = 'Migration1736683720375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign" ALTER COLUMN "status" SET DEFAULT 'CREATED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
    }

}

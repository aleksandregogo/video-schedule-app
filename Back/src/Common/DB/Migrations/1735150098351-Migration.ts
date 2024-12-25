import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1735150098351 implements MigrationInterface {
    name = 'Migration1735150098351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign" ADD "status" character varying(20) NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign" DROP COLUMN "status"`);
    }

}

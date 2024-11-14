import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1731621702779 implements MigrationInterface {
    name = 'Migration1731621702779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "aee"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "user_id_seq" OWNED BY "user"."id"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT nextval('"user_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq1')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "user_id_seq"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "aee" character varying NOT NULL`);
    }

}

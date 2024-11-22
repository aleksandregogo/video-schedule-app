import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1732275299623 implements MigrationInterface {
    name = 'Migration1732275299623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "phone_number" character varying NOT NULL, CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "location" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ADD "company_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "company_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_9e70b5f9d7095018e86970c7874" UNIQUE ("company_id")`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "user_id_seq" OWNED BY "user"."id"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT nextval('"user_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "user_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_e4417d8dfc1bbe1edb0776848d4" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_9e70b5f9d7095018e86970c7874" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_9e70b5f9d7095018e86970c7874"`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_e4417d8dfc1bbe1edb0776848d4"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "user_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq1')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "user_id_seq"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_9e70b5f9d7095018e86970c7874"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "company_id"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "company_id"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "name"`);
        await queryRunner.query(`DROP TABLE "company"`);
    }

}

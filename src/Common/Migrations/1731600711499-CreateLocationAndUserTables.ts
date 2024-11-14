import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLocationAndUserTables1731600711499 implements MigrationInterface {
    name = 'CreateLocationAndUserTables1731600711499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "personal_number" character varying NOT NULL, "facebook_id" character varying, "google_id" character varying, "email" character varying, "profile_picture" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "location" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "lat" numeric(10,8) NOT NULL, "lon" numeric(11,8) NOT NULL, "image" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "corporation" character varying NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}

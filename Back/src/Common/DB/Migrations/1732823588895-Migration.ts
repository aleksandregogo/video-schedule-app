import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1732823588895 implements MigrationInterface {
    name = 'Migration1732823588895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "booking" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'PENDING', "location_id" integer, "user_id" integer, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "corporation"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "status" character varying(20) NOT NULL DEFAULT 'OFF'`);
        await queryRunner.query(`ALTER TABLE "location" ADD "image_key" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "location" ADD "image_bucket" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "location" RENAME COLUMN "lon" TO "lng"`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD "location_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD "company_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_9e70b5f9d7095018e86970c7874"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "REL_9e70b5f9d7095018e86970c787"`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_e4417d8dfc1bbe1edb0776848d4"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "company_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_9e70b5f9d7095018e86970c7874" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_e4417d8dfc1bbe1edb0776848d4" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "FK_34ba743f121e44b86f3eda22a47" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "FK_d36799a8756490b289971e03f6b" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "FK_9fe77978fc1aff6b180cfce5e77" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_4e96c5ff59cd32f90bdccfc3fc1" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_276896d1a1a30be6de9d7d43f53" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_276896d1a1a30be6de9d7d43f53"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_4e96c5ff59cd32f90bdccfc3fc1"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "FK_9fe77978fc1aff6b180cfce5e77"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "FK_d36799a8756490b289971e03f6b"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "FK_34ba743f121e44b86f3eda22a47"`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_e4417d8dfc1bbe1edb0776848d4"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_9e70b5f9d7095018e86970c7874"`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "company_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_e4417d8dfc1bbe1edb0776848d4" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location" RENAME COLUMN "lng" TO "lon"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "REL_9e70b5f9d7095018e86970c787" UNIQUE ("company_id")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_9e70b5f9d7095018e86970c7874" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP COLUMN "company_id"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP COLUMN "location_id"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "image_bucket"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "image_key"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "image" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ADD "corporation" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "booking"`);
    }

}

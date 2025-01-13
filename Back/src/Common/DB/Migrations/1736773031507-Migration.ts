import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1736773031507 implements MigrationInterface {
    name = 'Migration1736773031507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "phone_number" character varying NOT NULL, CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "user_name" character varying, "email" character varying, "profile_picture" character varying, "personal_number" character varying, "facebook_id" character varying, "google_id" character varying, "company_id" integer, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "screen" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(50) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'OFF', "lat" numeric(10,8) NOT NULL, "lng" numeric(11,8) NOT NULL, "image_key" character varying(500), "image_bucket" character varying(50), "price" numeric(10,2) NOT NULL, "company_id" integer NOT NULL, CONSTRAINT "PK_7d30806a7556636b84d24e75f4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "media" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "uuid" uuid NOT NULL, "key" character varying(500) NOT NULL, "bucket_name" character varying(50) NOT NULL, "format" character varying(20) NOT NULL, "size" integer NOT NULL, "duration" character varying(20), "user_id" integer, CONSTRAINT "UQ_2d6760ea1f49ca137ddc33620b1" UNIQUE ("uuid"), CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id")); COMMENT ON COLUMN "media"."format" IS 'format of tracks. (MP4)'; COMMENT ON COLUMN "media"."duration" IS 'Total duration of the composition.'`);
        await queryRunner.query(`CREATE TABLE "campaign" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "uuid" uuid NOT NULL, "name" character varying(100) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'CREATED', "screen_id" integer NOT NULL, "company_id" integer NOT NULL, "user_id" integer NOT NULL, "media_id" integer, CONSTRAINT "UQ_5401d34520c7747d2cfff228e48" UNIQUE ("uuid"), CONSTRAINT "REL_5de7db3a6f75a4fca5754feaa7" UNIQUE ("media_id"), CONSTRAINT "PK_0ce34d26e7f2eb316a3a592cdc4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(50) NOT NULL, "start_time" TIMESTAMP NOT NULL DEFAULT now(), "end_time" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying(20) NOT NULL DEFAULT 'PENDING', "screen_id" integer, "campaign_id" integer, CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_9e70b5f9d7095018e86970c7874" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "screen" ADD CONSTRAINT "FK_442ec4976b55bc4bfd03a5d9d96" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "media" ADD CONSTRAINT "FK_c0dd13ee4ffc96e61bdc1fb592d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "FK_243c16ecf4dd39e0423c662655a" FOREIGN KEY ("screen_id") REFERENCES "screen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "FK_d36799a8756490b289971e03f6b" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "FK_9fe77978fc1aff6b180cfce5e77" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "FK_5de7db3a6f75a4fca5754feaa70" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_ea527289c117e2e0b623cc18d54" FOREIGN KEY ("screen_id") REFERENCES "screen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_065a2cd951f25393da948be2e6d" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_065a2cd951f25393da948be2e6d"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_ea527289c117e2e0b623cc18d54"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "FK_5de7db3a6f75a4fca5754feaa70"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "FK_9fe77978fc1aff6b180cfce5e77"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "FK_d36799a8756490b289971e03f6b"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "FK_243c16ecf4dd39e0423c662655a"`);
        await queryRunner.query(`ALTER TABLE "media" DROP CONSTRAINT "FK_c0dd13ee4ffc96e61bdc1fb592d"`);
        await queryRunner.query(`ALTER TABLE "screen" DROP CONSTRAINT "FK_442ec4976b55bc4bfd03a5d9d96"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_9e70b5f9d7095018e86970c7874"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`DROP TABLE "campaign"`);
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`DROP TABLE "screen"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "company"`);
    }

}

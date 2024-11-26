import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1732650996674 implements MigrationInterface {
    name = 'Migration1732650996674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "campaign" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "uuid" uuid NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "UQ_5401d34520c7747d2cfff228e48" UNIQUE ("uuid"), CONSTRAINT "PK_0ce34d26e7f2eb316a3a592cdc4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "media" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "uuid" uuid NOT NULL, "upload_complete" boolean NOT NULL DEFAULT false, "key" character varying(500) NOT NULL, "bucket_name" character varying(50) NOT NULL, "format" character varying(20) NOT NULL, "size" integer NOT NULL, "duration" character varying(20), "campaign_id" integer, "user_id" integer, CONSTRAINT "UQ_2d6760ea1f49ca137ddc33620b1" UNIQUE ("uuid"), CONSTRAINT "REL_32d75477568ed6e416a44023d7" UNIQUE ("campaign_id"), CONSTRAINT "REL_c0dd13ee4ffc96e61bdc1fb592" UNIQUE ("user_id"), CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id")); COMMENT ON COLUMN "media"."format" IS 'format of tracks. (MP4)'; COMMENT ON COLUMN "media"."duration" IS 'Total duration of the composition.'`);
        await queryRunner.query(`ALTER TABLE "media" ADD CONSTRAINT "FK_32d75477568ed6e416a44023d7f" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "media" ADD CONSTRAINT "FK_c0dd13ee4ffc96e61bdc1fb592d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP CONSTRAINT "FK_c0dd13ee4ffc96e61bdc1fb592d"`);
        await queryRunner.query(`ALTER TABLE "media" DROP CONSTRAINT "FK_32d75477568ed6e416a44023d7f"`);
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`DROP TABLE "campaign"`);
    }

}

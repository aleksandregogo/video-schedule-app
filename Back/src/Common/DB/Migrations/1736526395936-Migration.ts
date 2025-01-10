import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1736526395936 implements MigrationInterface {
    name = 'Migration1736526395936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "FK_5de7db3a6f75a4fca5754feaa70"`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "UQ_5de7db3a6f75a4fca5754feaa70" UNIQUE ("media_id")`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "FK_5de7db3a6f75a4fca5754feaa70" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "FK_5de7db3a6f75a4fca5754feaa70"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "UQ_5de7db3a6f75a4fca5754feaa70"`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "FK_5de7db3a6f75a4fca5754feaa70" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

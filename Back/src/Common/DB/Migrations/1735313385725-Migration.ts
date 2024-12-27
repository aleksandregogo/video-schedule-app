import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1735313385725 implements MigrationInterface {
    name = 'Migration1735313385725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_065a2cd951f25393da948be2e6d"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_065a2cd951f25393da948be2e6d" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_065a2cd951f25393da948be2e6d"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_065a2cd951f25393da948be2e6d" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

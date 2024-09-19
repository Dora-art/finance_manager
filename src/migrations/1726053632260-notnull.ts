import { MigrationInterface, QueryRunner } from "typeorm";

export class Notnull1726053632260 implements MigrationInterface {
    name = 'Notnull1726053632260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget" DROP CONSTRAINT "FK_8ed65c868c97a5fb471d85efb01"`);
        await queryRunner.query(`ALTER TABLE "budget" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "budget" ADD CONSTRAINT "FK_8ed65c868c97a5fb471d85efb01" FOREIGN KEY ("userId") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget" DROP CONSTRAINT "FK_8ed65c868c97a5fb471d85efb01"`);
        await queryRunner.query(`ALTER TABLE "budget" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "budget" ADD CONSTRAINT "FK_8ed65c868c97a5fb471d85efb01" FOREIGN KEY ("userId") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
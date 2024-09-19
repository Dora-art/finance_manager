import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactoredEntites1724681221068 implements MigrationInterface {
    name = 'RefactoredEntites1724681221068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "totalAmount"`);
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "budget" ADD "amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "budget" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "person" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "person" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_06e076479515578ab1933ab4375"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_a09e4ae0273f63ed09f9eae0a30"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "PK_edd925b450e13ea36197c9590fc"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "budgetId"`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "budgetId" uuid`);
        await queryRunner.query(`ALTER TABLE "budget" DROP CONSTRAINT "FK_8ed65c868c97a5fb471d85efb01"`);
        await queryRunner.query(`ALTER TABLE "budget" DROP CONSTRAINT "PK_9af87bcfd2de21bd9630dddaa0e"`);
        await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "budget" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "budget" ADD CONSTRAINT "PK_9af87bcfd2de21bd9630dddaa0e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "budget" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "person" DROP CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3"`);
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "person" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "person" ADD CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "person" ADD CONSTRAINT "UQ_d2d717efd90709ebd3cb26b936c" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_06e076479515578ab1933ab4375" FOREIGN KEY ("userId") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_a09e4ae0273f63ed09f9eae0a30" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budget" ADD CONSTRAINT "FK_8ed65c868c97a5fb471d85efb01" FOREIGN KEY ("userId") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget" DROP CONSTRAINT "FK_8ed65c868c97a5fb471d85efb01"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_a09e4ae0273f63ed09f9eae0a30"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_06e076479515578ab1933ab4375"`);
        await queryRunner.query(`ALTER TABLE "person" DROP CONSTRAINT "UQ_d2d717efd90709ebd3cb26b936c"`);
        await queryRunner.query(`ALTER TABLE "person" DROP CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3"`);
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "person" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "person" ADD CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "budget" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "budget" DROP CONSTRAINT "PK_9af87bcfd2de21bd9630dddaa0e"`);
        await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "budget" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "budget" ADD CONSTRAINT "PK_9af87bcfd2de21bd9630dddaa0e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "budget" ADD CONSTRAINT "FK_8ed65c868c97a5fb471d85efb01" FOREIGN KEY ("userId") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "budgetId"`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "budgetId" integer`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "date" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "PK_edd925b450e13ea36197c9590fc"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_a09e4ae0273f63ed09f9eae0a30" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_06e076479515578ab1933ab4375" FOREIGN KEY ("userId") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "person" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "person" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "budget" ADD "totalAmount" integer NOT NULL`);
    }

}

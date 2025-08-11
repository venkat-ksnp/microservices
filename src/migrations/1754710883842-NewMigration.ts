import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1754710883842 implements MigrationInterface {
    name = 'NewMigration1754710883842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "profileImage" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profileImage"`);
    }

}

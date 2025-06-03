import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeDescriptionNullable1748942923441
  implements MigrationInterface
{
  name = 'MakeDescriptionNullable1748942923441';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz" ALTER COLUMN "description" DROP NOT NULL`,
    );

    await queryRunner.query(
      `UPDATE "quiz" SET description = NULL WHERE description = '';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "quiz" SET "description" = '' WHERE "description" IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "quiz" ALTER COLUMN "description" SET NOT NULL`,
    );
  }
}

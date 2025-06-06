import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeDescriptionNullable1748973141859
  implements MigrationInterface
{
  name = 'MakeDescriptionNullable1748973141859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz" ALTER COLUMN "description" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz" ALTER COLUMN "description" SET NOT NULL`,
    );
  }
}

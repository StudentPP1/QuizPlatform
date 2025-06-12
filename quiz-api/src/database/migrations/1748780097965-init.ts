import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1748780097965 implements MigrationInterface {
  name = 'Init1748780097965';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "review" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" integer NOT NULL DEFAULT '0', "text" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "quizId" uuid, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."task_type_enum" AS ENUM('text', 'single', 'multiple')`,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying(255) NOT NULL, "type" "public"."task_type_enum" NOT NULL, "correctAnswers" json, "options" json, "image" character varying(500), "publicId" character varying(500), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quizId" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quiz" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "timeLimit" integer NOT NULL, "rating" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" uuid, CONSTRAINT "PK_422d974e7217414e029b3e641d0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quiz_result" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "quizId" uuid, CONSTRAINT "PK_87b85729df5cb6f6e136daeea4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_authprovider_enum" AS ENUM('local', 'google')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255), "googleId" character varying(255), "authProvider" "public"."users_authprovider_enum" NOT NULL, "avatarUrl" character varying(500), "rating" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tokenHash" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quiz_participants_users" ("quizId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_8b85a5790d4b56296fea1ab0003" PRIMARY KEY ("quizId", "usersId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_190358a0fa9f2edb23130772ba" ON "quiz_participants_users" ("quizId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_47989f88d790f187402a2c0e32" ON "quiz_participants_users" ("usersId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_2924b33279ef60b8945e5cc6c58" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_d5930fb9608371258c3c57f0dbe" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz" ADD CONSTRAINT "FK_155a5e61914fd82daef9da16dfa" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_result" ADD CONSTRAINT "FK_4abf6cd9299375deb44f23f170a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_result" ADD CONSTRAINT "FK_9220c1b7b2ecc84d5edb11abd88" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_participants_users" ADD CONSTRAINT "FK_190358a0fa9f2edb23130772ba1" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_participants_users" ADD CONSTRAINT "FK_47989f88d790f187402a2c0e32d" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz_participants_users" DROP CONSTRAINT "FK_47989f88d790f187402a2c0e32d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_participants_users" DROP CONSTRAINT "FK_190358a0fa9f2edb23130772ba1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_result" DROP CONSTRAINT "FK_9220c1b7b2ecc84d5edb11abd88"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_result" DROP CONSTRAINT "FK_4abf6cd9299375deb44f23f170a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz" DROP CONSTRAINT "FK_155a5e61914fd82daef9da16dfa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_d5930fb9608371258c3c57f0dbe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_2924b33279ef60b8945e5cc6c58"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_47989f88d790f187402a2c0e32"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_190358a0fa9f2edb23130772ba"`,
    );
    await queryRunner.query(`DROP TABLE "quiz_participants_users"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_authprovider_enum"`);
    await queryRunner.query(`DROP TABLE "quiz_result"`);
    await queryRunner.query(`DROP TABLE "quiz"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TYPE "public"."task_type_enum"`);
    await queryRunner.query(`DROP TABLE "review"`);
  }
}

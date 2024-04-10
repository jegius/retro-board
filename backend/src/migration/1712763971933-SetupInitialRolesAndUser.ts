import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SetupInitialRolesAndUser1712763971933 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "role_entity" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(50) UNIQUE NOT NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_entity" (
        "id" SERIAL PRIMARY KEY,
        "username" VARCHAR(100) NOT NULL,
        "email" VARCHAR(100) NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "registeredAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "roleId" INT,
        CONSTRAINT "FK_roleId" FOREIGN KEY ("roleId") REFERENCES "role_entity"("id") ON DELETE SET NULL
      );
    `);

    const adminRoleName = process.env.ADMIN_ROLE_NAME || 'ADMIN';
    const userRoleName = process.env.USER_ROLE_NAME || 'USER';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    const roleAdminExists = await queryRunner.query(`SELECT id FROM "role_entity" WHERE name = '${adminRoleName}'`);
    const roleUserExists = await queryRunner.query(`SELECT id FROM "role_entity" WHERE name = '${userRoleName}'`);

    let adminRoleId: number;

    if (!roleAdminExists.length) {
      await queryRunner.query(`INSERT INTO "role_entity" (name) VALUES ('${adminRoleName}') RETURNING "id"`);
      adminRoleId = (await queryRunner.query(`SELECT id FROM "role_entity" WHERE name = '${adminRoleName}'`))[0].id;
    }

    if (!roleUserExists.length) {
      await queryRunner.query(`INSERT INTO "role_entity" (name) VALUES ('${userRoleName}')`);
    }

    const adminExists = await queryRunner.query(`SELECT id FROM "user_entity" WHERE username = '${adminUsername}'`);

    if (!adminExists.length) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await queryRunner.query(
        `INSERT INTO "user_entity" (username, email, password, "roleId") VALUES ('${adminUsername}', '${adminEmail}', '${hashedPassword}', ${adminRoleId})`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const adminRoleName = process.env.ADMIN_ROLE_NAME || 'ADMIN';
    const userRoleName = process.env.USER_ROLE_NAME || 'USER';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';

    await queryRunner.query(`DELETE FROM "user_entity" WHERE username = '${adminUsername}'`);
    await queryRunner.query(`DELETE FROM "role_entity" WHERE name IN ('${adminRoleName}', '${userRoleName}')`);

    await queryRunner.query(`DROP TABLE IF EXISTS "user_entity"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "role_entity"`);
  }
}
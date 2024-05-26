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

    // Затем создаем таблицу 'user_entity'
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "user_entity" (
            "id" SERIAL PRIMARY KEY,
            "username" VARCHAR(100) NOT NULL,
            "email" VARCHAR(100) NOT NULL,
            "password" VARCHAR(255) NOT NULL,
            "registeredAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "avatarUrl" VARCHAR(255)
            );
    `);

    // После этого создаем таблицу 'user_roles', которая ссылается на 'user_entity' и 'role_entity'
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "user_roles" (
            "user_id" int NOT NULL,
            "role_id" int NOT NULL,
            CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "user_entity"("id") ON DELETE CASCADE,
            CONSTRAINT "fk_role_id" FOREIGN KEY ("role_id") REFERENCES "role_entity"("id") ON DELETE CASCADE,
            PRIMARY KEY ("user_id", "role_id")
            );
    `);
    const adminRoleName = process.env.ADMIN_ROLE_NAME || 'ADMIN';
    const boardMaster = process.env.BOARD_MASTER || 'BOARD_MASTER';
    const userRoleName = process.env.USER_ROLE_NAME || 'USER';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    const roleAdminExists = await queryRunner.query(`SELECT id FROM "role_entity" WHERE name = '${adminRoleName}'`);
    const roleUserExists = await queryRunner.query(`SELECT id FROM "role_entity" WHERE name = '${userRoleName}'`);
    const roleBoardMasterExists = await queryRunner.query(`SELECT id FROM "role_entity" WHERE name = '${boardMaster}'`);

    let adminRoleId: number;

    if (!roleAdminExists.length) {
      await queryRunner.query(`INSERT INTO "role_entity" (name) VALUES ('${adminRoleName}') RETURNING "id"`);
      adminRoleId = (await queryRunner.query(`SELECT id FROM "role_entity" WHERE name = '${adminRoleName}'`))[0].id;
    }

    if (!roleUserExists.length) {
      await queryRunner.query(`INSERT INTO "role_entity" (name) VALUES ('${userRoleName}')`);
    }

    if (!roleBoardMasterExists.length) {
      await queryRunner.query(`INSERT INTO "role_entity" (name) VALUES ('${boardMaster}')`);
    }

    const adminUser = await queryRunner.query(`SELECT id FROM "user_entity" WHERE email = '${adminEmail}'`);
    if (!adminUser.length) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newUser = await queryRunner.query(
        `INSERT INTO "user_entity" (username, email, password) VALUES ('${adminUsername}', '${adminEmail}', '${hashedPassword}') RETURNING "id"`
      );
      const newUserId = newUser[0].id;

      await queryRunner.query(
        `INSERT INTO "user_roles" ("user_id", "role_id") VALUES (${newUserId}, ${adminRoleId})`
      );
    }

  }


  public async down(queryRunner: QueryRunner): Promise<void> {
    const adminRoleName = process.env.ADMIN_ROLE_NAME || 'ADMIN';
    const userRoleName = process.env.USER_ROLE_NAME || 'USER';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';

    await queryRunner.query(`DELETE FROM "user_entity" WHERE username = '${adminUsername}'`);
    await queryRunner.query(`DELETE FROM "role_entity" WHERE name IN ('${adminRoleName}', '${userRoleName}')`);

    await queryRunner.query(`DROP TABLE IF EXISTS "user_roles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_entity"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "role_entity"`);
  }
}
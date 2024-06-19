import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SetupInitialRolesAndUser1678645809200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создание таблицы roles
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "roles" (
                                               "id" SERIAL PRIMARY KEY,
                                               "name" VARCHAR(50) UNIQUE NOT NULL
            );
    `);

    // Создание таблицы users
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "users" (
                                               "id" SERIAL PRIMARY KEY,
                                               "username" VARCHAR(100) NOT NULL,
            "email" VARCHAR(100) NOT NULL,
            "password" VARCHAR(255) NOT NULL,
            "registeredAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "avatarUrl" VARCHAR(255)
            );
    `);

    // Создание таблицы user_roles
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "user_roles" (
                                                    "user_id" int NOT NULL,
                                                    "role_id" int NOT NULL,
                                                    CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
            CONSTRAINT "fk_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE,
            PRIMARY KEY ("user_id", "role_id")
            );
    `);

    // Создание таблицы boards
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "boards" (
                                                "id" SERIAL PRIMARY KEY,
                                                "title" VARCHAR NOT NULL,
                                                "creationDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                "creatorId" int,
                                                CONSTRAINT "FK_boards_creator" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE
            );
    `);

    // Создание таблицы sessions
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "sessions" (
                                                  "id" SERIAL PRIMARY KEY,
                                                  "boardId" int,
                                                  "startDate" TIMESTAMP,
                                                  "creationDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                  "sessionStatus" VARCHAR NOT NULL,
                                                  "title" VARCHAR NOT NULL,
                                                  CONSTRAINT "fk_session_board_id" FOREIGN KEY ("boardId") REFERENCES "boards"("id")
            );
    `);

    // Создание таблицы sections
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "sections" (
                                                  "id" SERIAL PRIMARY KEY,
                                                  "title" VARCHAR NOT NULL,
                                                  "type" VARCHAR NOT NULL,
                                                  "sessionId" int,
                                                  CONSTRAINT "fk_session_id" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id")
            );
    `);

    // Создание таблицы columns
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "columns" (
                                                 "id" SERIAL PRIMARY KEY,
                                                 "type" VARCHAR(255) NOT NULL,
            "order" int NOT NULL,
            "title" VARCHAR(255) NOT NULL,
            "sectionId" int,
            CONSTRAINT "fk_section_id" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE CASCADE
            );
    `);

    // Создание таблицы issues
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "issues" (
                                                "id" SERIAL PRIMARY KEY,
                                                "message" VARCHAR NOT NULL,
                                                "stickerUrls" TEXT[],
                                                "likes" int DEFAULT 0,
                                                "type" VARCHAR NOT NULL,
                                                "authorId" int NOT NULL,
                                                "creationDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                "columnId" int,
                                                CONSTRAINT "fk_column_id" FOREIGN KEY ("columnId") REFERENCES "columns"("id"),
            CONSTRAINT "fk_author_id" FOREIGN KEY ("authorId") REFERENCES "users"("id")
            );
    `);

    // Создание таблицы comments
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "comments" (
                                                  "id" SERIAL PRIMARY KEY,
                                                  "message" VARCHAR NOT NULL,
                                                  "likes" int DEFAULT 0,
                                                  "authorId" int,
                                                  "creationDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                  "answerForId" int,
                                                  "issueId" int,
                                                  CONSTRAINT "fk_comment_author_id" FOREIGN KEY ("authorId") REFERENCES "users"("id"),
            CONSTRAINT "fk_comment_answer_for_id" FOREIGN KEY ("answerForId") REFERENCES "comments"("id"),
            CONSTRAINT "fk_issue_id" FOREIGN KEY ("issueId") REFERENCES "issues"("id")
            );
    `);

    // Создание таблицы stickers
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "stickers" (
                                                  "id" SERIAL PRIMARY KEY,
                                                  "url" VARCHAR NOT NULL
        );
    `);

    // Создание таблицы rating_items
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "rating_items" (
                                                      "id" SERIAL PRIMARY KEY,
                                                      "authorId" int,
                                                      "value" int NOT NULL,
                                                      "stickerUrls" TEXT[],
                                                      "sectionId" int,
                                                      CONSTRAINT "fk_rating_item_author_id" FOREIGN KEY ("authorId") REFERENCES "users"("id"),
            CONSTRAINT "fk_section_id" FOREIGN KEY ("sectionId") REFERENCES "sections"("id")
            );
    `);

    // Создание таблицы board_sections
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "board_sections" (
                                                        "id" SERIAL PRIMARY KEY,
                                                        "title" VARCHAR NOT NULL,
                                                        "type" VARCHAR NOT NULL,
                                                        "viewStatus" VARCHAR(255) NOT NULL,
            "sessionId" int,
            CONSTRAINT "fk_view_session_id" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id")
            );
    `);

    // Создание таблицы rating_sections
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "rating_sections" (
                                                         "id" SERIAL PRIMARY KEY,
                                                         "title" VARCHAR NOT NULL,
                                                         "type" VARCHAR NOT NULL,
                                                         "sessionId" int,
                                                         CONSTRAINT "fk_rating_session_id" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id")
            );
    `);

    // Создание начальных ролей и администратора
    const adminRoleName = process.env.ADMIN_ROLE_NAME || 'ADMIN';
    const boardMasterRoleName = process.env.BOARD_MASTER_NAME || 'BOARD_MASTER';
    const userRoleName = process.env.USER_ROLE_NAME || 'USER';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    // Вставка ролей
    await queryRunner.query(`
      DO
      $$
      BEGIN
        INSERT INTO "roles" (name) VALUES ('${adminRoleName}')
          ON CONFLICT DO NOTHING;

        INSERT INTO "roles" (name) VALUES ('${userRoleName}')
          ON CONFLICT DO NOTHING;

        INSERT INTO "roles" (name) VALUES ('${boardMasterRoleName}')
          ON CONFLICT DO NOTHING;
      END
      $$;
    `);

    // Получение id созданных ролей
    const [adminRoleId] = await queryRunner.query(`SELECT id FROM "roles" WHERE name = '${adminRoleName}'`);
    const [boardMasterRoleId] = await queryRunner.query(`SELECT id FROM "roles" WHERE name = '${boardMasterRoleName}'`);

    // Создание администратора, если не существует
    const adminUserExists = await queryRunner.query(`SELECT id FROM "users" WHERE email = '${adminEmail}'`);
    if (adminUserExists.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const [{ id: newAdminUserId }] = await queryRunner.query(`
          INSERT INTO "users" (username, email, password) VALUES ('${adminUsername}', '${adminEmail}', '${hashedPassword}')
              RETURNING id;
      `);

      // Присваивание роли администратору
      await queryRunner.query(`
          INSERT INTO "user_roles" (user_id, role_id) VALUES (${newAdminUserId}, ${adminRoleId.id});
          INSERT INTO "user_roles" (user_id, role_id) VALUES (${newAdminUserId}, ${boardMasterRoleId.id});
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаление администратора
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    await queryRunner.query(`DELETE FROM "users" WHERE username = '${adminUsername}'`);

    // Удаление таблиц в обратном порядке создания
    await queryRunner.query(`DROP TABLE IF EXISTS "rating_sections"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "board_sections"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "rating_items"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "stickers"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "comments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "issues"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "columns"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sections"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sessions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "boards"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_roles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "roles"`);
  }
}
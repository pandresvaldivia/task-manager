/*
  Warnings:

  - You are about to drop the column `board_id` on the `tasks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_board_id_fkey";

-- DropIndex
DROP INDEX "tasks_board_id_idx";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "board_id";

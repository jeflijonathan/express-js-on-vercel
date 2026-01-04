/*
  Warnings:

  - You are about to drop the column `idStatusBongkar` on the `sesibongkar` table. All the data in the column will be lost.
  - You are about to drop the `statusbongkar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `sesibongkar` DROP FOREIGN KEY `SesiBongkar_idStatusBongkar_fkey`;

-- DropIndex
DROP INDEX `SesiBongkar_idStatusBongkar_fkey` ON `sesibongkar`;

-- AlterTable
ALTER TABLE `sesibongkar` DROP COLUMN `idStatusBongkar`;

-- DropTable
DROP TABLE `statusbongkar`;

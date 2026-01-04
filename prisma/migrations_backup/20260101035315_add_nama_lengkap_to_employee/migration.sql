/*
  Warnings:

  - You are about to drop the column `idKoorLap` on the `sesibongkar` table. All the data in the column will be lost.
  - Added the required column `koorlapId` to the `SesiBongkar` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `sesibongkar` DROP FOREIGN KEY `SesiBongkar_idKoorLap_fkey`;

-- DropIndex
DROP INDEX `SesiBongkar_idKoorLap_fkey` ON `sesibongkar`;

-- AlterTable
ALTER TABLE `sesibongkar` DROP COLUMN `idKoorLap`,
    ADD COLUMN `koorlapId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `SesiBongkar` ADD CONSTRAINT `SesiBongkar_koorlapId_fkey` FOREIGN KEY (`koorlapId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

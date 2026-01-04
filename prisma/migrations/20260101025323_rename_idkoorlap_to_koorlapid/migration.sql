/*
  Warnings:

  - You are about to drop the column `idKoorLap` on the `laporan` table. All the data in the column will be lost.
  - You are about to drop the column `idKoorLap` on the `recordtarifbongkar` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `laporan` DROP FOREIGN KEY `Laporan_idKoorLap_fkey`;

-- DropForeignKey
ALTER TABLE `recordtarifbongkar` DROP FOREIGN KEY `RecordTarifBongkar_idKoorLap_fkey`;

-- DropIndex
DROP INDEX `Laporan_idKoorLap_fkey` ON `laporan`;

-- DropIndex
DROP INDEX `RecordTarifBongkar_idKoorLap_fkey` ON `recordtarifbongkar`;

-- AlterTable
ALTER TABLE `laporan` DROP COLUMN `idKoorLap`,
    ADD COLUMN `koorlapId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `recordtarifbongkar` DROP COLUMN `idKoorLap`,
    ADD COLUMN `koorlapId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Laporan` ADD CONSTRAINT `Laporan_koorlapId_fkey` FOREIGN KEY (`koorlapId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordTarifBongkar` ADD CONSTRAINT `RecordTarifBongkar_koorlapId_fkey` FOREIGN KEY (`koorlapId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE `sesibongkar` DROP FOREIGN KEY `SesiBongkar_idGroupTeam_fkey`;

-- DropIndex
DROP INDEX `SesiBongkar_idGroupTeam_fkey` ON `sesibongkar`;

-- AlterTable
ALTER TABLE `employee` MODIFY `namaLengkap` VARCHAR(191) NULL;

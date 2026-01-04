/*
  Warnings:

  - You are about to drop the `gaji` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tarifbongkar` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `platContainer` on table `sesibongkar` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `gaji` DROP FOREIGN KEY `Gaji_angkutId_fkey`;

-- DropForeignKey
ALTER TABLE `gaji` DROP FOREIGN KEY `Gaji_containerSizeId_fkey`;

-- DropForeignKey
ALTER TABLE `gaji` DROP FOREIGN KEY `Gaji_koorlapId_fkey`;

-- DropForeignKey
ALTER TABLE `gaji` DROP FOREIGN KEY `Gaji_tradeTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `tarifbongkar` DROP FOREIGN KEY `TarifBongkar_idAngkut_fkey`;

-- DropForeignKey
ALTER TABLE `tarifbongkar` DROP FOREIGN KEY `TarifBongkar_idBarang_fkey`;

-- DropForeignKey
ALTER TABLE `tarifbongkar` DROP FOREIGN KEY `TarifBongkar_idContainerSize_fkey`;

-- DropForeignKey
ALTER TABLE `tarifbongkar` DROP FOREIGN KEY `TarifBongkar_idTradeType_fkey`;

-- AlterTable
ALTER TABLE `activitylog` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `detaillaporan` MODIFY `gajiKaryawan` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `hargaBongkar` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `laporan` ADD COLUMN `idKoorLap` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `sesibongkar` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `startAT` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `platContainer` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `gaji`;

-- DropTable
DROP TABLE `tarifbongkar`;

-- CreateTable
CREATE TABLE `StevedoringRate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idBarang` INTEGER NOT NULL,
    `idContainerSize` INTEGER NOT NULL,
    `idTradeType` INTEGER NOT NULL,
    `idAngkut` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `jasaWrapping` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecordStevedoringRate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idLaporan` INTEGER NOT NULL,
    `idBarang` INTEGER NOT NULL,
    `idContainerSize` INTEGER NOT NULL,
    `idTradeType` INTEGER NOT NULL,
    `idAngkut` INTEGER NOT NULL,
    `idKoorLap` VARCHAR(191) NULL,
    `jasaWrapping` BOOLEAN NOT NULL DEFAULT false,
    `amount` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecordWageLabor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idLaporan` INTEGER NOT NULL,
    `angkutId` INTEGER NOT NULL,
    `tradeTypeId` INTEGER NOT NULL,
    `containerSizeId` INTEGER NOT NULL,
    `koorlapId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `angkutId` INTEGER NOT NULL,
    `tradeTypeId` INTEGER NOT NULL,
    `containerSizeId` INTEGER NOT NULL,
    `gaji` DOUBLE NOT NULL,
    `koorlapId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StevedoringRate` ADD CONSTRAINT `StevedoringRate_idTradeType_fkey` FOREIGN KEY (`idTradeType`) REFERENCES `TradeType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StevedoringRate` ADD CONSTRAINT `StevedoringRate_idAngkut_fkey` FOREIGN KEY (`idAngkut`) REFERENCES `Angkut`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StevedoringRate` ADD CONSTRAINT `StevedoringRate_idContainerSize_fkey` FOREIGN KEY (`idContainerSize`) REFERENCES `ContainerSize`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StevedoringRate` ADD CONSTRAINT `StevedoringRate_idBarang_fkey` FOREIGN KEY (`idBarang`) REFERENCES `Barang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Laporan` ADD CONSTRAINT `Laporan_idKoorLap_fkey` FOREIGN KEY (`idKoorLap`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordStevedoringRate` ADD CONSTRAINT `RecordStevedoringRate_idLaporan_fkey` FOREIGN KEY (`idLaporan`) REFERENCES `Laporan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordStevedoringRate` ADD CONSTRAINT `RecordStevedoringRate_idTradeType_fkey` FOREIGN KEY (`idTradeType`) REFERENCES `TradeType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordStevedoringRate` ADD CONSTRAINT `RecordStevedoringRate_idAngkut_fkey` FOREIGN KEY (`idAngkut`) REFERENCES `Angkut`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordStevedoringRate` ADD CONSTRAINT `RecordStevedoringRate_idContainerSize_fkey` FOREIGN KEY (`idContainerSize`) REFERENCES `ContainerSize`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordStevedoringRate` ADD CONSTRAINT `RecordStevedoringRate_idBarang_fkey` FOREIGN KEY (`idBarang`) REFERENCES `Barang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordStevedoringRate` ADD CONSTRAINT `RecordStevedoringRate_idKoorLap_fkey` FOREIGN KEY (`idKoorLap`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordWageLabor` ADD CONSTRAINT `RecordWageLabor_idLaporan_fkey` FOREIGN KEY (`idLaporan`) REFERENCES `Laporan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordWageLabor` ADD CONSTRAINT `RecordWageLabor_angkutId_fkey` FOREIGN KEY (`angkutId`) REFERENCES `Angkut`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordWageLabor` ADD CONSTRAINT `RecordWageLabor_tradeTypeId_fkey` FOREIGN KEY (`tradeTypeId`) REFERENCES `TradeType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordWageLabor` ADD CONSTRAINT `RecordWageLabor_containerSizeId_fkey` FOREIGN KEY (`containerSizeId`) REFERENCES `ContainerSize`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordWageLabor` ADD CONSTRAINT `RecordWageLabor_koorlapId_fkey` FOREIGN KEY (`koorlapId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wage` ADD CONSTRAINT `Wage_angkutId_fkey` FOREIGN KEY (`angkutId`) REFERENCES `Angkut`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wage` ADD CONSTRAINT `Wage_tradeTypeId_fkey` FOREIGN KEY (`tradeTypeId`) REFERENCES `TradeType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wage` ADD CONSTRAINT `Wage_containerSizeId_fkey` FOREIGN KEY (`containerSizeId`) REFERENCES `ContainerSize`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wage` ADD CONSTRAINT `Wage_koorlapId_fkey` FOREIGN KEY (`koorlapId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

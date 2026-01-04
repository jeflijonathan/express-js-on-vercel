/*
  Warnings:

  - You are about to drop the `recordstevedoringrate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recordwagelabor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stevedoringrate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `recordstevedoringrate` DROP FOREIGN KEY `RecordStevedoringRate_idAngkut_fkey`;

-- DropForeignKey
ALTER TABLE `recordstevedoringrate` DROP FOREIGN KEY `RecordStevedoringRate_idBarang_fkey`;

-- DropForeignKey
ALTER TABLE `recordstevedoringrate` DROP FOREIGN KEY `RecordStevedoringRate_idContainerSize_fkey`;

-- DropForeignKey
ALTER TABLE `recordstevedoringrate` DROP FOREIGN KEY `RecordStevedoringRate_idKoorLap_fkey`;

-- DropForeignKey
ALTER TABLE `recordstevedoringrate` DROP FOREIGN KEY `RecordStevedoringRate_idLaporan_fkey`;

-- DropForeignKey
ALTER TABLE `recordstevedoringrate` DROP FOREIGN KEY `RecordStevedoringRate_idTradeType_fkey`;

-- DropForeignKey
ALTER TABLE `recordwagelabor` DROP FOREIGN KEY `RecordWageLabor_angkutId_fkey`;

-- DropForeignKey
ALTER TABLE `recordwagelabor` DROP FOREIGN KEY `RecordWageLabor_containerSizeId_fkey`;

-- DropForeignKey
ALTER TABLE `recordwagelabor` DROP FOREIGN KEY `RecordWageLabor_idLaporan_fkey`;

-- DropForeignKey
ALTER TABLE `recordwagelabor` DROP FOREIGN KEY `RecordWageLabor_koorlapId_fkey`;

-- DropForeignKey
ALTER TABLE `recordwagelabor` DROP FOREIGN KEY `RecordWageLabor_tradeTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `stevedoringrate` DROP FOREIGN KEY `StevedoringRate_idAngkut_fkey`;

-- DropForeignKey
ALTER TABLE `stevedoringrate` DROP FOREIGN KEY `StevedoringRate_idBarang_fkey`;

-- DropForeignKey
ALTER TABLE `stevedoringrate` DROP FOREIGN KEY `StevedoringRate_idContainerSize_fkey`;

-- DropForeignKey
ALTER TABLE `stevedoringrate` DROP FOREIGN KEY `StevedoringRate_idTradeType_fkey`;

-- DropForeignKey
ALTER TABLE `wage` DROP FOREIGN KEY `Wage_angkutId_fkey`;

-- DropForeignKey
ALTER TABLE `wage` DROP FOREIGN KEY `Wage_containerSizeId_fkey`;

-- DropForeignKey
ALTER TABLE `wage` DROP FOREIGN KEY `Wage_koorlapId_fkey`;

-- DropForeignKey
ALTER TABLE `wage` DROP FOREIGN KEY `Wage_tradeTypeId_fkey`;

-- DropTable
DROP TABLE `recordstevedoringrate`;

-- DropTable
DROP TABLE `recordwagelabor`;

-- DropTable
DROP TABLE `stevedoringrate`;

-- DropTable
DROP TABLE `wage`;

-- CreateTable
CREATE TABLE `TarifBongkar` (
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
CREATE TABLE `RecordTarifBongkar` (
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
CREATE TABLE `RecordGaji` (
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
CREATE TABLE `Gaji` (
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
ALTER TABLE `TarifBongkar` ADD CONSTRAINT `TarifBongkar_idTradeType_fkey` FOREIGN KEY (`idTradeType`) REFERENCES `TradeType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TarifBongkar` ADD CONSTRAINT `TarifBongkar_idAngkut_fkey` FOREIGN KEY (`idAngkut`) REFERENCES `Angkut`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TarifBongkar` ADD CONSTRAINT `TarifBongkar_idContainerSize_fkey` FOREIGN KEY (`idContainerSize`) REFERENCES `ContainerSize`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TarifBongkar` ADD CONSTRAINT `TarifBongkar_idBarang_fkey` FOREIGN KEY (`idBarang`) REFERENCES `Barang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordTarifBongkar` ADD CONSTRAINT `RecordTarifBongkar_idLaporan_fkey` FOREIGN KEY (`idLaporan`) REFERENCES `Laporan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordTarifBongkar` ADD CONSTRAINT `RecordTarifBongkar_idTradeType_fkey` FOREIGN KEY (`idTradeType`) REFERENCES `TradeType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordTarifBongkar` ADD CONSTRAINT `RecordTarifBongkar_idAngkut_fkey` FOREIGN KEY (`idAngkut`) REFERENCES `Angkut`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordTarifBongkar` ADD CONSTRAINT `RecordTarifBongkar_idContainerSize_fkey` FOREIGN KEY (`idContainerSize`) REFERENCES `ContainerSize`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordTarifBongkar` ADD CONSTRAINT `RecordTarifBongkar_idBarang_fkey` FOREIGN KEY (`idBarang`) REFERENCES `Barang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordTarifBongkar` ADD CONSTRAINT `RecordTarifBongkar_idKoorLap_fkey` FOREIGN KEY (`idKoorLap`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordGaji` ADD CONSTRAINT `RecordGaji_idLaporan_fkey` FOREIGN KEY (`idLaporan`) REFERENCES `Laporan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordGaji` ADD CONSTRAINT `RecordGaji_angkutId_fkey` FOREIGN KEY (`angkutId`) REFERENCES `Angkut`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordGaji` ADD CONSTRAINT `RecordGaji_tradeTypeId_fkey` FOREIGN KEY (`tradeTypeId`) REFERENCES `TradeType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordGaji` ADD CONSTRAINT `RecordGaji_containerSizeId_fkey` FOREIGN KEY (`containerSizeId`) REFERENCES `ContainerSize`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecordGaji` ADD CONSTRAINT `RecordGaji_koorlapId_fkey` FOREIGN KEY (`koorlapId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gaji` ADD CONSTRAINT `Gaji_angkutId_fkey` FOREIGN KEY (`angkutId`) REFERENCES `Angkut`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gaji` ADD CONSTRAINT `Gaji_tradeTypeId_fkey` FOREIGN KEY (`tradeTypeId`) REFERENCES `TradeType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gaji` ADD CONSTRAINT `Gaji_containerSizeId_fkey` FOREIGN KEY (`containerSizeId`) REFERENCES `ContainerSize`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gaji` ADD CONSTRAINT `Gaji_koorlapId_fkey` FOREIGN KEY (`koorlapId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

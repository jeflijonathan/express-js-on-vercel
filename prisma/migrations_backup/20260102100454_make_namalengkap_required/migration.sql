/*
  Warnings:

  - Made the column `namaLengkap` on table `employee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `employee` MODIFY `namaLengkap` VARCHAR(191) NOT NULL;

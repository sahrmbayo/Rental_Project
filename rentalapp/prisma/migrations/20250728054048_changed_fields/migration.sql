/*
  Warnings:

  - You are about to alter the column `price` on the `properties` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `landSize` on the `properties` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Made the column `landSize` on table `properties` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "price" SET DATA TYPE INTEGER,
ALTER COLUMN "landSize" SET NOT NULL,
ALTER COLUMN "landSize" SET DATA TYPE INTEGER;

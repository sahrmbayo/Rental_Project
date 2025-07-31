/*
  Warnings:

  - Added the required column `address` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `area` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyType` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "area" TEXT NOT NULL,
ADD COLUMN     "landSize" DOUBLE PRECISION,
ADD COLUMN     "propertyType" TEXT NOT NULL;

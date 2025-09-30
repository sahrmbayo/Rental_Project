/*
  Warnings:

  - You are about to drop the `property_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "property_images" DROP CONSTRAINT "property_images_propertyId_fkey";

-- DropTable
DROP TABLE "property_images";

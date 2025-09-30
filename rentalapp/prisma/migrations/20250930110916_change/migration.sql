/*
  Warnings:

  - You are about to drop the column `imageUr2` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `imageUr3` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `imageUr4` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `imageUr5` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `properties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "imageUr2",
DROP COLUMN "imageUr3",
DROP COLUMN "imageUr4",
DROP COLUMN "imageUr5",
DROP COLUMN "imageUrl",
ADD COLUMN     "images" JSONB;

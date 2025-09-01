/*
  Warnings:

  - You are about to drop the column `paymentProvider` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `paymentReference` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "paymentProvider",
DROP COLUMN "paymentReference",
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "Order";

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "checkoutSessionId" TEXT,
    "status" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

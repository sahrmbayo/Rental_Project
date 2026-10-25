-- Link orders to the reserved property
ALTER TABLE "orders" ADD COLUMN "propertyId" TEXT;
ALTER TABLE "orders" ADD CONSTRAINT "orders_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- paidAt is only set once payment is confirmed
ALTER TABLE "orders" ALTER COLUMN "paidAt" DROP NOT NULL;
ALTER TABLE "orders" ALTER COLUMN "paidAt" DROP DEFAULT;
UPDATE "orders" SET "paidAt" = NULL WHERE "status" IS DISTINCT FROM 'completed';

-- Indexes
CREATE INDEX "orders_userId_idx" ON "orders"("userId");
CREATE INDEX "orders_propertyId_idx" ON "orders"("propertyId");
CREATE INDEX "properties_agentId_idx" ON "properties"("agentId");
CREATE INDEX "properties_postedAt_idx" ON "properties"("postedAt");

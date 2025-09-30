-- CreateTable
CREATE TABLE "property_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

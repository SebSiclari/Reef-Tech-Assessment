-- CreateTable
CREATE TABLE "restaurant_data" (
    "id" SERIAL NOT NULL,
    "store_name" TEXT NOT NULL,
    "external_store_id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurant_opened_at" TIMESTAMP(3) NOT NULL,
    "menu_available" BOOLEAN NOT NULL,
    "restaurant_online" BOOLEAN NOT NULL,
    "restaurant_offline" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restaurant_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_data_external_store_id_key" ON "restaurant_data"("external_store_id");

-- CreateIndex
CREATE INDEX "restaurant_data_country_code_idx" ON "restaurant_data"("country_code");

-- CreateIndex
CREATE INDEX "restaurant_data_city_idx" ON "restaurant_data"("city");

-- CreateIndex
CREATE INDEX "restaurant_data_date_idx" ON "restaurant_data"("date");

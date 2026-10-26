-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "products" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "specs" TEXT[],
    "badge" TEXT,
    "description" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey"
        PRIMARY KEY ("id")
);

-- Product category constraint
ALTER TABLE "products"
ADD CONSTRAINT "products_category_check"
CHECK (
    "category" IN (
        'phone',
        'laptop',
        'tablet',
        'audio',
        'watch'
    )
);

-- Slug must be unique
CREATE UNIQUE INDEX
"products_slug_key"
ON "products"("slug");


-- CreateTable
CREATE TABLE "product_variants" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY,
    "product_id" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "storage" TEXT,
    "ram" TEXT,
    "price" DECIMAL(15,0) NOT NULL,
    "image" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at"
        TIMESTAMPTZ(6)
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_variants_pkey"
        PRIMARY KEY ("id")
);

-- SKU is globally unique
CREATE UNIQUE INDEX
"product_variants_sku_key"
ON "product_variants"("sku");

-- Query variants by product efficiently
CREATE INDEX
"product_variants_product_id_display_order_idx"
ON "product_variants"(
    "product_id",
    "display_order"
);

-- Price validation
ALTER TABLE "product_variants"
ADD CONSTRAINT "product_variants_price_check"
CHECK ("price" >= 0);

-- Product -> Variant
ALTER TABLE "product_variants"
ADD CONSTRAINT "product_variants_product_id_fkey"
FOREIGN KEY ("product_id")
REFERENCES "products"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
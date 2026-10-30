-- CreateEnum
CREATE TYPE "lease_status" AS ENUM ('DRAFT', 'ACTIVE', 'ENDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "maintenance_priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "maintenance_status" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "document_category" AS ENUM ('CONTRACTS', 'INVOICES', 'RECORDS', 'REPAIRS', 'PROPERTY', 'OTHER');

-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('PAYMENT_OVERDUE', 'CONTRACT_EXPIRING', 'URGENT_REPAIR', 'PAYMENT_RECEIVED', 'REPAIR_RESOLVED', 'NEW_DOCUMENT');

-- CreateEnum
CREATE TYPE "notification_severity" AS ENUM ('ERROR', 'WARNING', 'SUCCESS', 'INFO');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "ico" TEXT,
    "dic" TEXT,
    "iban" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "language" TEXT NOT NULL DEFAULT 'sk',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Bratislava',
    "notifications_email" BOOLEAN NOT NULL DEFAULT true,
    "notifications_push" BOOLEAN NOT NULL DEFAULT true,
    "contract_expiry_notice_days" INTEGER NOT NULL DEFAULT 30,
    "user_id" UUID NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "postal_code" TEXT NOT NULL,
    "is_problematic" BOOLEAN NOT NULL DEFAULT false,
    "monthly_rent" DECIMAL(12,2) NOT NULL,
    "utilities_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "deposit_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "rooms" INTEGER NOT NULL DEFAULT 1,
    "area" DECIMAL(7,2) NOT NULL,
    "floor" INTEGER NOT NULL DEFAULT 0,
    "total_floors" INTEGER NOT NULL DEFAULT 1,
    "has_elevator" BOOLEAN NOT NULL DEFAULT false,
    "has_balcony" BOOLEAN NOT NULL DEFAULT false,
    "has_cellar" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "owner_id" UUID NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_images" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "url" TEXT NOT NULL,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "property_id" UUID NOT NULL,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" UUID NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_equipment" (
    "property_id" UUID NOT NULL,
    "equipment_id" UUID NOT NULL,

    CONSTRAINT "property_equipment_pkey" PRIMARY KEY ("property_id","equipment_id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "id_card_number" TEXT,
    "notes" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "owner_id" UUID NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leases" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "rent_amount" DECIMAL(12,2) NOT NULL,
    "deposit_amount" DECIMAL(12,2) NOT NULL,
    "payment_day" INTEGER NOT NULL DEFAULT 1,
    "auto_renew" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "status" "lease_status" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "property_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,

    CONSTRAINT "leases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rent_charges" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "period" DATE NOT NULL,
    "due_date" DATE NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "variable_symbol" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "lease_id" UUID NOT NULL,

    CONSTRAINT "rent_charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "amount" DECIMAL(12,2) NOT NULL,
    "paid_at" DATE NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "charge_id" UUID NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contractors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "owner_id" UUID NOT NULL,

    CONSTRAINT "contractors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_records" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "maintenance_priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "maintenance_status" NOT NULL DEFAULT 'OPEN',
    "estimated_cost" DECIMAL(12,2),
    "actual_cost" DECIMAL(12,2),
    "resolved_date" DATE,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "property_id" UUID NOT NULL,
    "contractor_id" UUID,

    CONSTRAINT "maintenance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "category" "document_category" NOT NULL DEFAULT 'OTHER',
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_type" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" UUID NOT NULL,
    "property_id" UUID,
    "tenant_id" UUID,
    "lease_id" UUID,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "notification_type" NOT NULL,
    "severity" "notification_severity" NOT NULL DEFAULT 'INFO',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "action_route" TEXT,
    "action_entity_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE INDEX "properties_owner_id_created_at_idx" ON "properties"("owner_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "properties_owner_id_is_problematic_idx" ON "properties"("owner_id", "is_problematic");

-- CreateIndex
CREATE INDEX "property_images_property_id_sort_order_idx" ON "property_images"("property_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_owner_id_name_key" ON "equipment"("owner_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_owner_id_email_key" ON "tenants"("owner_id", "email");

-- CreateIndex
CREATE INDEX "leases_property_id_status_idx" ON "leases"("property_id", "status");

-- CreateIndex
CREATE INDEX "leases_tenant_id_idx" ON "leases"("tenant_id");

-- CreateIndex
CREATE INDEX "leases_status_end_date_idx" ON "leases"("status", "end_date");

-- CreateIndex
CREATE INDEX "rent_charges_due_date_idx" ON "rent_charges"("due_date");

-- CreateIndex
CREATE UNIQUE INDEX "rent_charges_lease_id_period_key" ON "rent_charges"("lease_id", "period");

-- CreateIndex
CREATE INDEX "payments_charge_id_idx" ON "payments"("charge_id");

-- CreateIndex
CREATE INDEX "contractors_owner_id_idx" ON "contractors"("owner_id");

-- CreateIndex
CREATE INDEX "maintenance_records_property_id_status_priority_idx" ON "maintenance_records"("property_id", "status", "priority");

-- CreateIndex
CREATE INDEX "documents_owner_id_category_idx" ON "documents"("owner_id", "category");

-- CreateIndex
CREATE INDEX "documents_property_id_idx" ON "documents"("property_id");

-- CreateIndex
CREATE INDEX "documents_tenant_id_idx" ON "documents"("tenant_id");

-- CreateIndex
CREATE INDEX "documents_lease_id_idx" ON "documents"("lease_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_created_at_idx" ON "notifications"("user_id", "read", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_equipment" ADD CONSTRAINT "property_equipment_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_equipment" ADD CONSTRAINT "property_equipment_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leases" ADD CONSTRAINT "leases_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leases" ADD CONSTRAINT "leases_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rent_charges" ADD CONSTRAINT "rent_charges_lease_id_fkey" FOREIGN KEY ("lease_id") REFERENCES "leases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_charge_id_fkey" FOREIGN KEY ("charge_id") REFERENCES "rent_charges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contractors" ADD CONSTRAINT "contractors_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_contractor_id_fkey" FOREIGN KEY ("contractor_id") REFERENCES "contractors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_lease_id_fkey" FOREIGN KEY ("lease_id") REFERENCES "leases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "keys" (
    "id" SERIAL NOT NULL,
    "priv_key" TEXT NOT NULL,
    "pub_key" TEXT NOT NULL,
    "key_type" VARCHAR(255) NOT NULL,
    "ip_address" VARCHAR(255) NOT NULL,
    "user_agent" VARCHAR(255) NOT NULL,
    "submission_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referer" TEXT NOT NULL,
    "fingerprint_validated" VARCHAR(3) NOT NULL,

    CONSTRAINT "keys_pkey" PRIMARY KEY ("id")
);

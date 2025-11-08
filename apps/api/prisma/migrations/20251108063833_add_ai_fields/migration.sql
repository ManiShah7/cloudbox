-- AlterTable
ALTER TABLE "public"."File" ADD COLUMN     "aiAnalyzed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "public"."SharedLink" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SharedLink_token_key" ON "public"."SharedLink"("token");

-- CreateIndex
CREATE INDEX "SharedLink_token_idx" ON "public"."SharedLink"("token");

-- CreateIndex
CREATE INDEX "SharedLink_fileId_idx" ON "public"."SharedLink"("fileId");

-- AddForeignKey
ALTER TABLE "public"."SharedLink" ADD CONSTRAINT "SharedLink_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

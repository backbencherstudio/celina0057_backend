/*
  Warnings:

  - You are about to drop the column `userId` on the `Foods` table. All the data in the column will be lost.
  - Added the required column `adminId` to the `Foods` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Foods" DROP CONSTRAINT "Foods_userId_fkey";

-- AlterTable
ALTER TABLE "Foods" DROP COLUMN "userId",
ADD COLUMN     "adminId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Foods" ADD CONSTRAINT "Foods_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

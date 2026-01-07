/*
  Warnings:

  - The primary key for the `logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `logs` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `userId` BIGINT NULL,
    ADD PRIMARY KEY (`id`);

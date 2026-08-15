CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "Provider" AS ENUM ('OPENAI', 'ANTHROPIC', 'GOOGLE', 'GROQ', 'MISTRAL', 'XAI', 'OPENROUTER');
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT,
  "avatar" TEXT,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
  "credits" INTEGER NOT NULL DEFAULT 100,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "ApiKey" (
  "id" TEXT NOT NULL,
  "provider" "Provider" NOT NULL,
  "encryptedKey" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ApiKey_userId_idx" ON "ApiKey"("userId");
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Conversation" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Conversation_userId_idx" ON "Conversation"("userId");
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Message" (
  "id" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "model" TEXT,
  "provider" "Provider",
  "promptTokens" INTEGER,
  "completionTokens" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "conversationId" TEXT NOT NULL,
  CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Task" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
  "dueDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Task_userId_idx" ON "Task"("userId");
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Usage" (
  "id" TEXT NOT NULL,
  "provider" "Provider" NOT NULL,
  "model" TEXT NOT NULL,
  "requests" INTEGER NOT NULL DEFAULT 0,
  "promptTokens" INTEGER NOT NULL DEFAULT 0,
  "completionTokens" INTEGER NOT NULL DEFAULT 0,
  "totalCost" DECIMAL(65,30) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT NOT NULL,
  CONSTRAINT "Usage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Usage_userId_createdAt_idx" ON "Usage"("userId", "createdAt");
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "CreditLedger" (
  "id" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "reason" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT NOT NULL,
  CONSTRAINT "CreditLedger_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CreditLedger_userId_createdAt_idx" ON "CreditLedger"("userId", "createdAt");
ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

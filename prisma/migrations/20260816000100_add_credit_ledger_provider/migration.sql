-- Add optional provider metadata to credit ledger entries.
ALTER TABLE "CreditLedger" ADD COLUMN "provider" "Provider";

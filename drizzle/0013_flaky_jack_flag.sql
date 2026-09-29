ALTER TABLE `document_requests` ADD `downloadTokenHash` varchar(128);--> statement-breakpoint
ALTER TABLE `document_requests` ADD `downloadExpiresAt` timestamp;--> statement-breakpoint
ALTER TABLE `document_requests` ADD `downloadedAt` timestamp;--> statement-breakpoint
ALTER TABLE `quote_requests` ADD `publicAccessToken` varchar(80);--> statement-breakpoint
ALTER TABLE `document_requests` ADD CONSTRAINT `document_requests_downloadTokenHash_unique` UNIQUE(`downloadTokenHash`);--> statement-breakpoint
ALTER TABLE `quote_requests` ADD CONSTRAINT `quote_requests_publicAccessToken_unique` UNIQUE(`publicAccessToken`);
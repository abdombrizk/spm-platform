CREATE TABLE `homepage_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentKey` varchar(128) NOT NULL,
	`contentType` enum('text','image','url','number') NOT NULL,
	`label` varchar(255) NOT NULL,
	`description` text,
	`draftValue` text NOT NULL,
	`publishedValue` text NOT NULL,
	`isVisible` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`updatedBy` int,
	`publishedBy` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`publishedAt` timestamp,
	CONSTRAINT `homepage_content_id` PRIMARY KEY(`id`),
	CONSTRAINT `homepage_content_contentKey_unique` UNIQUE(`contentKey`)
);

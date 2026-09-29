CREATE TABLE `document_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicNumber` varchar(40) NOT NULL,
	`productId` int,
	`documentType` enum('brochure','datasheet','user_manual','regulatory_document','technical_file','other') NOT NULL,
	`documentUrl` text,
	`documentName` varchar(255),
	`requesterName` varchar(255) NOT NULL,
	`requesterEmail` varchar(320) NOT NULL,
	`requesterOrganization` varchar(255),
	`message` text,
	`status` enum('pending','approved','rejected','sent') NOT NULL DEFAULT 'pending',
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `document_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `document_requests_publicNumber_unique` UNIQUE(`publicNumber`)
);
--> statement-breakpoint
CREATE TABLE `product_brands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`logoUrl` text,
	`menuImageUrl` text,
	`websiteUrl` text,
	`authorizedAgentLabel` varchar(255),
	`isVisible` boolean NOT NULL DEFAULT true,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdBy` int,
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_brands_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_brands_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `product_menu_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brandId` int,
	`productId` int,
	`parentId` int,
	`label` varchar(255) NOT NULL,
	`href` varchar(500) NOT NULL,
	`imageUrl` text,
	`iconName` varchar(80),
	`itemType` enum('brand','category','product','view_all','custom') NOT NULL DEFAULT 'custom',
	`isVisible` boolean NOT NULL DEFAULT true,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdBy` int,
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_menu_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `spare_part_brands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`name` varchar(255) NOT NULL,
	`introduction` text,
	`logoUrl` text,
	`heroImageUrl` text,
	`authorizedAgentLabel` varchar(255),
	`authorizationDocumentUrl` text,
	`isVisible` boolean NOT NULL DEFAULT true,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdBy` int,
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `spare_part_brands_id` PRIMARY KEY(`id`),
	CONSTRAINT `spare_part_brands_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `spare_parts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brandId` int,
	`slug` varchar(180) NOT NULL,
	`name` varchar(255) NOT NULL,
	`partNumber` varchar(180),
	`equipmentCategory` varchar(180),
	`description` text,
	`imageUrl` text,
	`availabilityStatus` enum('available','on_request','discontinued','coming_soon') NOT NULL DEFAULT 'on_request',
	`isVisible` boolean NOT NULL DEFAULT true,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdBy` int,
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `spare_parts_id` PRIMARY KEY(`id`),
	CONSTRAINT `spare_parts_slug_unique` UNIQUE(`slug`)
);

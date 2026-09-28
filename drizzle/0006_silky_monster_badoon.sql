CREATE TABLE `quote_attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteRequestId` int NOT NULL,
	`uploadedBy` int,
	`fileName` varchar(255) NOT NULL,
	`contentType` varchar(120) NOT NULL,
	`sizeBytes` int NOT NULL,
	`storageUrl` text NOT NULL,
	`description` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quote_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quote_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteRequestId` int NOT NULL,
	`userId` int NOT NULL,
	`body` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quote_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quote_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteRequestId` int NOT NULL,
	`itemType` enum('product','service','custom') NOT NULL,
	`productId` int,
	`serviceId` int,
	`itemName` varchar(255) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quote_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quote_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicNumber` varchar(40) NOT NULL,
	`customerAccountId` int,
	`organizationName` varchar(255),
	`requesterType` enum('doctor','biomedical_engineer','technician','procurement_officer','hospital','clinic','medical_center','distributor','private_company','government_entity','individual','other'),
	`contactPerson` varchar(255) NOT NULL,
	`jobTitle` varchar(180),
	`email` varchar(320) NOT NULL,
	`phone` varchar(80) NOT NULL,
	`whatsapp` varchar(80),
	`preferredContactMethod` enum('email','phone','whatsapp','any') NOT NULL DEFAULT 'any',
	`country` varchar(120) NOT NULL,
	`city` varchar(160),
	`address` text,
	`requiredDeliveryDate` varchar(40),
	`installationRequired` enum('yes','no','not_sure') NOT NULL DEFAULT 'not_sure',
	`trainingRequired` enum('yes','no','not_sure') NOT NULL DEFAULT 'not_sure',
	`maintenanceContractRequired` enum('yes','no','not_sure') NOT NULL DEFAULT 'not_sure',
	`message` text,
	`status` enum('new','under_review','assigned_to_sales','preparing_quotation','sent_to_customer','customer_responded','waiting_for_customer','waiting_for_technical_review','waiting_for_supplier','on_hold','won','lost','closed','cancelled') NOT NULL DEFAULT 'new',
	`priority` enum('low','normal','high','urgent') NOT NULL DEFAULT 'normal',
	`assignedSalesUserId` int,
	`assignedServiceUserId` int,
	`source` enum('website','product_page','service_page','whatsapp','email','manual','campaign') NOT NULL DEFAULT 'website',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`closedAt` timestamp,
	CONSTRAINT `quote_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `quote_requests_publicNumber_unique` UNIQUE(`publicNumber`)
);

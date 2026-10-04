ALTER TABLE products ADD COLUMN submittedBy INT NULL, ADD COLUMN reviewedBy INT NULL, ADD COLUMN reviewedAt TIMESTAMP NULL;
ALTER TABLE services ADD COLUMN submittedBy INT NULL;
ALTER TABLE cms_pages ADD COLUMN submittedBy INT NULL;
ALTER TABLE quote_requests MODIFY COLUMN publicAccessToken VARCHAR(128) NULL;
ALTER TABLE service_requests MODIFY COLUMN publicAccessToken VARCHAR(128) NOT NULL;
UPDATE quote_requests SET publicAccessToken = SHA2(publicAccessToken, 256) WHERE publicAccessToken IS NOT NULL AND CHAR_LENGTH(publicAccessToken) <> 64;
UPDATE service_requests SET publicAccessToken = SHA2(publicAccessToken, 256) WHERE CHAR_LENGTH(publicAccessToken) <> 64;
ALTER TABLE user_permissions ADD CONSTRAINT user_permissions_user_permission_unique UNIQUE (userId, permission);

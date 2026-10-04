ALTER TABLE products MODIFY COLUMN workflowStatus ENUM('draft','pending_review','approved','published','archived') NOT NULL DEFAULT 'draft';
CREATE INDEX products_workflow_visible_idx ON products (workflowStatus, publishedVisible, displayOrder);
CREATE INDEX services_workflow_visible_idx ON services (workflowStatus, publishedVisible, displayOrder);
CREATE INDEX quote_requests_status_updated_idx ON quote_requests (status, updatedAt);
CREATE INDEX service_requests_status_updated_idx ON service_requests (status, updatedAt);
CREATE INDEX document_requests_token_expiry_idx ON document_requests (downloadTokenHash, downloadExpiresAt);

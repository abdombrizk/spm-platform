export const PERMISSIONS = [
  "homepage.edit", "homepage.media", "homepage.publish",
  "content.view", "content.edit", "content.media", "content.review", "content.publish", "content.delete", "content.stats",
  "documents.approve",
  "products.view", "products.create", "products.edit", "products.media", "products.quality", "products.publish", "products.archive", "products.delete",
  "services.view", "services.create", "services.edit", "services.media", "services.quality", "services.publish", "services.archive", "services.delete",
  "quotes.view", "quotes.create", "quotes.edit", "quotes.attachments", "quotes.assign", "quotes.status", "quotes.close", "quotes.delete", "quotes.export",
  "service_requests.view", "service_requests.create", "service_requests.edit", "service_requests.attachments", "service_requests.comments", "service_requests.assign", "service_requests.status", "service_requests.priority", "service_requests.close", "service_requests.delete", "service_requests.schedule",
] as const;
export type Permission = typeof PERMISSIONS[number];

# SPM Corporate Website and Management Platform

A full-stack corporate website and controlled internal management platform for **Systems for Projects & Maintenance (SPM)**.

The platform is designed for a medical-imaging business with public content, product and service catalogues, structured request journeys, role-based access control, auditability, and a quality-aware publication workflow.

## Project status

This repository contains the current working platform foundation and the implemented website modules. The system is intentionally delivered in controlled modules so that each area can be reviewed, tested, and approved before the next operational workflow is added.

## Implemented modules

- Internal email/password authentication with secure password hashing and sessions.
- Owner-managed users, roles, granular permissions, and audit logs.
- Forced first-login password change for newly created accounts.
- Homepage CMS with drafts, publication, visibility control, and managed media upload.
- Public product catalogue with product detail pages.
- Product drafts, publication, archive/restore, media, brochures, Request a Quote, and quality/CE fields.
- Product permissions for view, create, edit, media, quality, publish, archive, and delete.
- Public Services & Maintenance catalogue with service detail pages.
- Service types including installation, commissioning, preventive and corrective maintenance, emergency maintenance, calibration, technical support, training, spare-parts supply, and maintenance contracts.
- Service scope, included/excluded activities, response time, countries, supported brands, covered products, media, Request Service, and Request a Quote fields.
- Service workflow: Draft → Pending Review → Approved → Published → Archived.
- Service permissions for view, create, edit, media, quality approval, publish, archive, and delete.
- Request for Quote intake accepting products, services, multiple items, and custom requests.
- Optional organization and requester type for doctors, technicians, engineers, procurement teams, facilities, companies, and individuals.
- Quote attachments with PDF, Office, image, and video formats; up to 5 files, 10 MB per file, and 30 MB total.
- Quote request number generation, priority, assignment, status workflow, internal comments, and protected operational management.
- Product and service detail pages linked directly to the structured quote request form.
- Public Service Request intake supporting one or more devices in one request.
- Device identity and fault fields covering manufacturer, model, serial number, asset number, warranty, location, operational status, safety status, error code, alarm message, occurrence pattern, previous maintenance, and problem description.
- Service request attachments for photos, error screens, reports, Office/PDF files, and MP4/MOV videos; up to 10 files, 20 MB per file, and 100 MB total.
- Per-request access token protection for public attachment uploads, with a no-patient-identifiable-information acknowledgement.
- Service request number generation, service linkage, priority, assignment, status workflow, internal comments, quote linkage, and protected operational management.
- Owner-controlled Service Request permissions for viewing, assignment, priority, status, comments, scheduling, closing, attachment management, and deletion.
- Public catalogue filtering and responsive layouts.

## Technology stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui and Radix UI primitives
- Express
- tRPC 11
- Drizzle ORM
- MySQL/TiDB-compatible database
- Vitest
- Managed object storage for media
- Manus OAuth infrastructure for platform-level runtime support
- Internal SPM authentication for operational users

## Repository structure

```text
client/
  public/                 Small public configuration files
  src/
    components/           Shared UI and layout components
    pages/                Public pages and management screens
    contexts/              React contexts
    lib/trpc.ts            Typed tRPC client
    App.tsx                Application routes
    index.css              Global design tokens and styles

drizzle/
  schema.ts               Database schema
  migrations/             Generated migration history

server/
  _core/                  Runtime and platform infrastructure
  db.ts                   Database access helpers
  internalAuth.ts         Password hashing and internal sessions
  routers.ts              Typed API contracts and permission guards
  storage.ts              Managed file storage helpers
  *.test.ts               Server-side tests

shared/                    Shared constants and types
README.md                  Project documentation
package.json               Scripts and dependencies
```

## Local development

### Requirements

- Node.js 22 or compatible LTS version
- pnpm 10+
- MySQL/TiDB-compatible database
- Managed storage configuration for media uploads

### Install dependencies

```bash
pnpm install
```

### Environment configuration

Create a local `.env` file from the deployment environment or your approved secrets manager. Do not commit `.env` files or credentials.

The runtime expects platform-provided values such as:

- `DATABASE_URL`
- `JWT_SECRET`
- `BUILT_IN_FORGE_API_URL`
- `BUILT_IN_FORGE_API_KEY`
- `OWNER_OPEN_ID`
- `OWNER_NAME`

Additional platform environment variables may be supplied by the managed WebDev runtime. Use `server/_core/env.ts` as the source of truth for the variables consumed by the application.

### Database workflow

After a schema change:

```bash
pnpm drizzle-kit generate
```

Review the generated SQL migration before applying it to the configured database. Apply migrations through the approved deployment/database workflow.

### Run the development server

```bash
pnpm dev
```

### Quality checks

```bash
pnpm check
pnpm test
pnpm build
```

## Authentication and authorization

The platform uses internal email/password authentication for SPM operational users.

Supported roles currently include:

- Owner
- Manager
- Marketing
- Sales
- Service
- QA
- RA
- User

The Owner controls access using granular permissions. Authorization is enforced in the server procedures and is not only a frontend visibility rule.

Important security behaviours:

- Passwords are stored as secure hashes, never plaintext.
- New users can be required to change a temporary password at first login.
- Sensitive authentication fields are excluded from client responses.
- Owner actions and important content operations are written to the audit log.
- Public routes expose published content only.
- Draft and internal quality content remain protected by server-side permissions.

## Content publication model

Public content is managed through a controlled lifecycle:

1. Create or update a draft.
2. Submit the record for review when the module requires review.
3. Complete quality or regulatory review where applicable.
4. Approve the record.
5. Publish it to the public website.
6. Archive it instead of deleting it when operational history should be retained.

Product and service records are not seeded with invented business data. Official company content, product data, service data, certificates, images, and brochures must be entered by authorized SPM users.

## Quality and regulatory note

The platform provides fields and workflow controls for quality and regulatory review. These controls support internal operational governance, but the website itself does not constitute CE certification, ISO 13485 certification, a regulatory submission, or legal advice. Official claims and documents must be reviewed and approved by the responsible SPM QA/RA and management personnel.

## Media handling

Large media files should be uploaded through the managed storage workflow. Do not place large images, videos, or documents in `client/public` or in the repository. Store references/URLs in the database and retain source files according to the company's document-control procedure.

## Working conventions

- Keep API contracts in tRPC procedures and consume them through the typed client.
- Protect every internal mutation with a server-side permission guard.
- Prefer archive workflows for business records over permanent deletion.
- Keep requirements and acceptance criteria atomic and verifiable.
- Add or update tests when a workflow or permission rule changes.
- Do not add sample business data without explicit approval.
- Do not commit credentials, environment files, private certificates, or customer data.

## Next planned areas

The next implementation modules can build on the current foundation:

- Spare-parts requests.
- Email notification templates and routing.
- CRM and operational reporting.
- QA/RA document review and controlled evidence records.

## Maintainer notes

This repository is connected to the SPM WebDev project and should be changed through reviewed commits. Before any production release, verify the domain, email delivery, storage policy, backups, access list, quality claims, and acceptance test evidence with the responsible SPM stakeholders.

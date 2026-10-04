# SPM Security Remediation Session Todo

Started: 2026-10-04
Source: `pasted_content.txt` (45 findings)

## Completed in this pass

- [x] Private storage prefixes require an active internal session; storage keys are served through the proxy.
- [x] Public product/service/CMS responses use explicit allowlists and reject unsafe asset schemes.
- [x] Visitor-supplied document URLs were removed; approval derives a selected approved public document.
- [x] Document approval is restricted to owner/QA/RA or `documents.approve` and is audited.
- [x] Product/service/page review states, separate submit/approve actions, reviewer separation, and reset-to-draft on edits.
- [x] Product visibility no longer republishes draft content; quality approval is required before product publication.
- [x] Public mutation rate limits, proxy-aware IP handling, CSRF Origin checks, Helmet headers, secure cookies, and bounded upload validation.
- [x] Upload magic-byte/MIME validation, file-size limits, aggregate quote/service limits, hashed public access tokens, and constant-time token comparisons.
- [x] Generic login errors, dummy password verification, lockout counter reset, active-session checks, session revocation on password/account changes, and stronger scrypt parameters with legacy compatibility.
- [x] Shopify HTML is sanitized server-side; unsafe client fallback interpolation was removed.
- [x] Express 5 and patched dependencies upgraded; dead OAuth/demo AI/chart dependencies removed; production audit now reports no known high-severity vulnerabilities.
- [x] Document downloads use path tokens, no-referrer headers, and one-time token consumption.
- [x] Unverified public ISO/CE claims were removed from visible copy until evidence is uploaded and approved.
- [x] README, CI security workflow, migrations, typecheck, tests, build, and runtime smoke checks updated.

## Remaining operational work requiring infrastructure or an explicit product decision

- [ ] Password recovery email flow: requires a configured transactional email provider and approved sender/template.
- [ ] Outbox/retry/confirmation emails: requires the same email provider and delivery policy.
- [ ] Storage deletion lifecycle: requires a supported Forge/S3 delete API and retention policy before deleting customer files.
- [ ] Full transaction/FK migration and cursor pagination across all operational lists: requires production data audit and migration window.
- [ ] Structured logging/monitoring/Sentry and consent-managed analytics: requires provider credentials and privacy decisions.
- [ ] Arabic/i18n/RTL: product/content scope decision required.

## Verification

- `pnpm check` passed.
- `pnpm test` passed: 10 files, 22 tests passed, 1 skipped.
- `pnpm build` passed.
- `pnpm audit --prod --audit-level=high` passed: no known vulnerabilities.
- Local Express 5 runtime passed: home 200, unauthenticated private storage 404, invalid document path 403.

## Migration files

- `drizzle/0014_security_workflow.sql`
- `drizzle/0015_workflow_review_fields.sql`

Do not apply migrations to production until the SQL is reviewed against the live database schema and existing data.

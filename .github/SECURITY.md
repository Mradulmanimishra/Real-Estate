# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| main    | ✅        |

## Reporting a Vulnerability

If you discover a security vulnerability, **do not open a public issue**.

Instead, email directly: mradulmanimishra@gmail.com

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We'll respond within 48 hours and work with you to resolve it responsibly.

## Known Security Considerations

- JWT tokens expire in 55 minutes (access) / 1 day (refresh)
- Refresh tokens are blacklisted on logout
- Email verification required before login
- All property creation endpoints require authentication
- Environment variables must never be committed to the repo

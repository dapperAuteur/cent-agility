# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.2   | :x:                |

## Reporting a Vulnerability

**DO NOT** open public issues for security vulnerabilities.

Email **security@awews.com** with:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline
- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Status Update**: Every 7 days until resolved
- **Public Disclosure**: After fix released (coordinated with reporter)

### Disclosure Policy
We follow coordinated disclosure:
1. Vulnerability reported privately
2. Fix developed and tested
3. Security patch released
4. Public advisory published (with credit to reporter)

## Security Best Practices

### For Users
- Keep app updated to latest version
- Use strong, unique passwords
- Enable 2FA when available
- Review profile privacy settings
- Don't share account credentials

### For Contributors
- Never commit secrets (.env files, API keys)
- Validate all user input
- Use parameterized queries (Supabase handles this)
- Enable RLS on new database tables
- Test auth flows in incognito mode
- Follow OWASP guidelines

## Known Security Considerations

### Data Storage
- **Offline data**: Stored in IndexedDB (not encrypted at rest)
- **Sensitive data**: Only email/username stored
- **Session data**: No PII in drill records

### Authentication
- Supabase Auth (email/password)
- Optional anonymous usage
- Row-level security on all tables

### Network
- HTTPS enforced in production
- CORS configured for specific origins
- Rate limiting on API routes

## Security Tools

We use:
- **Dependabot**: Automated dependency updates
- **npm audit**: Regular vulnerability scans
- **ESLint security plugins**: Static analysis
- **Supabase RLS**: Database-level access control

## Acknowledgments

We thank security researchers who responsibly disclose vulnerabilities. Hall of Fame:

_(No submissions yet)_

---

**Contact**: security@awews.com  
**PGP Key**: Available on request

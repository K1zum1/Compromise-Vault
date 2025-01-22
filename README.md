
# Compromise Vault

### A web application designed to securely aggregate and manage known compromised SSH keys, providing system administrators with a centralized repository to enhance security and prevent unauthorized access. Additionally allows the generation of an openSSH formated key revocation list to be used towards blocking compromised keys

> ⚠️ **Warning:** This repository only exposes the frontend code and is only used for testing UI features. Unfortunately, the production version is unavailable to the general public. However the full project is availible with backend capabilites to try [here](https://ssh-aggregator.vercel.app/) for yourself. 

![SSH Key Submission](ssh.jpg)

## Table of Contents

- [Description](#description)
- [Services](#services)
- [Environment Setup](#environment-setup)
- [Database Sync](#database-sync)
- [Installation](#installation)
- [Development](#development)
  - [Front-end](#front-end)
  - [Backend API](#backend-api)
- [Database Schema](#database-schema)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact Information](#contact-information)

---

## Description

Compromise Vault is a web application designed to manage the submission and tracking of SSH keys. It allows users to submit SSH private and public keys, ensures their validity, and stores them securely in a database. This project is useful for administrators and developers who are looking to generate key revocation lists in order to blacklist these compromised keys.

## Services

- **apps/api**: Backend server powered by `ExpressJS`.
- **apps/web**: Frontend application powered by `React` and `Next.js`.

## Environment Setup

1. NodeJS minimum version 18.
2. Install pnpm:
   ```bash
   npm install -g pnpm
   ```
3. Create `.env` files in `apps/api` and `apps/web` with appropriate environment variables.

## Database Sync

In the `apps/api` directory, sync the database schema with the following command:
```bash
pnpm db:push
```

## Installation

In the project root, install all dependencies:
```bash
pnpm install
```

## Development

### Front-end

To start the frontend development server:
```bash
pnpm -F @my-app/web dev

# Alternative
make web-dev

# Alternative
cd apps/api
pnpm dev
```

### Backend API

To start the backend API server:
```bash
pnpm -F @my-app/api start

# Alternative
make api-dev

# Alternative
cd apps/api
pnpm dev
```

## Database Schema

### Table: SSHKeys

| Column Name          | Data Type                   | Max Length | Default           | Nullable |
|----------------------|-----------------------------|------------|-------------------|----------|
| id                   | serial                      | -          | -                 | NO       |
| privKey              | text                        | -          | null              | YES      |
| pubKey               | text                        | -          | null              | YES      |
| keyType              | character varying           | 255        | null              | YES      |
| ipAddress            | character varying           | 255        | null              | YES      |
| userAgent            | text                        | -          | null              | YES      |
| submissionDate       | timestamp without time zone | -          | CURRENT_TIMESTAMP | YES      |
| referer              | text                        | -          | null              | YES      |
| fingerprintValidated | boolean                     | -          | null              | YES      |
| fingerprint          | text                        | -          | null              | NO       |

### Table Creation Script:

```sql
CREATE TABLE SSHKeys (
    id SERIAL PRIMARY KEY,
    privKey TEXT,
    pubKey TEXT,
    keyType VARCHAR(255),
    ipAddress VARCHAR(255),
    userAgent TEXT,
    submissionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    referer TEXT,
    fingerprintValidated BOOLEAN
);
```



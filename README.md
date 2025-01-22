
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


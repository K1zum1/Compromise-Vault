# Fullstack Template

## Table of contents

- [Services](#markdown-header-services)
- [Installation](#markdown-header-installation)
- [Development](#markdown-header-development)
  - [Front-end](#markdown-header-front-end)
  - [Api](#markdown-header-api)
- [Test](#markdown-header-test)

## Services

- apps/api: the backend server powered by `expressjs`
- apps/web: the frontend application powered by `react, next`

### Environment

```
1. NodeJS minimum version 18

2. Pnpm command
	- npm i -g pnpm (if you don't have yet)

3. Setup .env at apps/api and apps/web
```

### Sync database

```
cd apps/api

pnpm db:push
```

## Installation

In the project root, run:

```
pnpm install
```

### Front-end

```
pnpm -F @my-app/web dev

or -------

make web-dev

or -------

cd apps/api
pnpm dev
```

### Backend API

```
pnpm -F @my-app/api start

or -------

make api-dev

or -------

cd apps/api
pnpm dev
```

## Database Schema

### Table: keys

| table_name | column_name           | data_type                   | is_nullable | column_default                          |
|------------|------------------------|-----------------------------|-------------|-----------------------------------------|
| keys       | id                    | integer                     | NO          | nextval('keys_id_seq'::regclass)        |
| keys       | priv_key              | text                        | NO          | null                                    |
| keys       | pub_key               | text                        | NO          | null                                    |
| keys       | key_type              | character varying           | NO          | null                                    |
| keys       | ip_address            | character varying           | NO          | null                                    |
| keys       | user_agent            | character varying           | NO          | null                                    |
| keys       | submission_date       | timestamp without time zone | NO          | CURRENT_TIMESTAMP                       |
| keys       | referer               | text                        | NO          | null                                    |
| keys       | fingerprint_validated | boolean                     | NO          | null                                    |

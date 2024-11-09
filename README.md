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

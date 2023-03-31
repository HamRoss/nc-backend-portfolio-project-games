# Northcoders House of Games API

## Introduction

House of Games is a social application based around board game reviews.

For a JSON representation of available endpoints, visit: https://northcoders-backend-project-games-api.onrender.com/api

This project was originally built as a week-long solo backend project on the Northcoders Coding Bootcamp. Eventually, it will also have a frontend to make it easier for users.

## Runnning the backend project locally

## System requirements

- Node.js v19.6.0
- PostgreSQL v14.7

### 1. Fork and clone the repo

`git clone https://github.com/HamRoss/nc-backend-portfolio-project-games`

### 2. Open the repo and install dependencies

`npm install`

### 3. Add .env files

To successfully connect to dev and test databases locally, you need to create two two .env files called .env.development and .env.test. These should set PGDATABASE with the correct database name. You can see the correct database names in setup.sql.

### 4. Set-up the database

`npm run setup-dbs`

### 5. Seed the database

`npm run seed`

### 6. Run tests

`npm run test`

## ACCORDIA PORTAL IV MEAN
### Angular 20 + Node JS + Express + Prisma ORM + MySQL

\
Welcome to **ACCORDIA PORTAL IV MEAN** repository! \
\
This repository serves as a central workspace for developing, maintaining, and deploying Accordia Portal IV MEAN frontend and backend code

Prerequisite:
- Node JS v22+
- npm
- MySQL
Tip:


## Frontend setup

### Install & Run

```bash
cd client
npm i
ng serve --configuration=development
```

Frontend will be available at http://localhost:4200

## Backend setup

### Install & Run

```bash
cd server
npm i
npm start
```

Backend API will be available at http://localhost:3000

## Database setup

1. Ensure MySQL is running
2. Configure database credentials in backend environment config
3. Run Prisma migrations:

``bash
npx prisma migrate dev --name init
```

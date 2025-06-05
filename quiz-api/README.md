# Quiz API

Quiz API is a backend service for managing quizzes, users, tasks, reviews, and authentication. It is part of a monorepo called `QuizPlatform`, which also contains the frontend project (`quiz-web`).

This API is built with **NestJS**, uses **TypeORM** for database interaction, and is connected to a **PostgreSQL** database.

---

## 📁 Project Structure

```
QuizPlatform/
├── quiz-api/       # This backend service (you are here)
├── quiz-web/       # Frontend app
```

Inside `quiz-api/src`:

```
src/
├── auth/             # Authentication (local + Google OAuth)
├── common/           # Shared interfaces, utilities, DTOs etc.
├── mail/             # Email service for send welcome mail
├── quiz/             # Quiz interaction and participation
├── review/           # Quiz reviews and ratings
├── task/             # Individual tasks/questions inside quizzes
├── token/            # JWT access/refresh tokens logic
├── users/            # User profiles and management
├── app.module.ts     # Root module
├── config.schema.ts  # Environment config validation
├── main.ts           # Entry point
```

---

## 🚀 Features

- User registration and login (email + Google OAuth)
- JWT authentication (access/refresh tokens)
- Quiz creation and solving
- Rating and review system
- Mailing a welcome letter (via Nodemailer)

---

## 🛠️ Tech Stack

- **Node.js** + **NestJS**
- **TypeScript**
- **PostgreSQL** + **TypeORM**
- **JWT** (Access & Refresh tokens)
- **Google OAuth 2.0**
- **Nodemailer**
- **Cloudinary** (Image storage)
- **Docker** + **Docker Compose** 🐳
- **Yarn** as package manager

---

## 📦 Installation

1. **Clone the monorepo and navigate to quiz-api**

```bash
git clone https://github.com/StudentPP1/QuizPlatform.git
cd QuizPlatform/quiz-api
```

2. **Install dependencies**

```bash
yarn install
```

3. **Create environment variables**

Copy the `.env.example` file to create the appropriate environment file:

```bash
cp .env.example .env.development.local    # For development
cp .env.example .env.production.local     # For production
```

Edit the corresponding files and fill in the required variables:

- `env.development.local` for development
- `env.production.local` for production

4. **Run the development server (with Docker Compose)**

> 🐳 Make sure you have Docker and Docker Compose installed.  
> ⚙️ Ensure `.env.development.local` is configured with the required environment variables.

```bash
# Start the development environment
docker-compose -f docker-compose.development.yml up --build
```

This will:

- Start the PostgreSQL container
- Start the NestJS app in development mode
- Watch for file changes thanks to the volume mount

To stop the containers:

```bash
docker-compose -f docker-compose.development.yml down
```

5. **Run the production server (with Docker Compose)**

> 🐳 Make sure you have Docker and Docker Compose installed.  
> ⚙️ Ensure `.env.production.local` is configured with the required environment variables.

```bash
# Build and run the production container
docker-compose -f docker-compose.production.yml up --build -d
```

This will:

- Build the app using multi-stage Dockerfile
- Start the container with production-ready settings
- Serve the app on port 80 of your host machine

To stop the container:

```bash
docker-compose -f docker-compose.production.yml down
```

6. **Manual start**

> 📝 The original Yarn-based commands still work when running the app directly on your machine:

```bash
# Development
yarn start:dev

# Production
yarn build
yarn start:prod
```

---

## 📋 API Endpoints

> 🧭 All API routes are prefixed with `/api` (e.g., `/api/auth/login`).

| Method | Route                                   | Description                                                          | Auth |
| ------ | --------------------------------------- | -------------------------------------------------------------------- | ---- |
| POST   | /auth/signup                            | Register a new user                                                  | ❌   |
| POST   | /auth/login                             | Log in with email and password                                       | ❌   |
| GET    | /auth/google                            | Start Google OAuth flow                                              | ❌   |
| GET    | /auth/google/redirect                   | Handle Google OAuth redirect                                         | ❌   |
| GET    | /auth/logout                            | Log out                                                              | ✅   |
| POST   | /quiz/create                            | Create a new quiz                                                    | ✅   |
| PUT    | /quiz/update/:id                        | Update a quiz by its ID                                              | ✅   |
| DELETE | /quiz/delete/:id                        | Delete a quiz by its ID                                              | ✅   |
| POST   | /quiz/:quizId/results                   | Submit results for a quiz by its ID                                  | ✅   |
| GET    | /quiz/:quizId/info                      | Retrieve quiz information by its ID                                  | ✅   |
| GET    | /quiz/search?name=name&from=1&to=11     | Search quizzes by name with pagination                               | ✅   |
| GET    | /quiz/top-rated?limit=3                 | Retrieve top-rated quizzes                                           | ✅   |
| POST   | /review/:quizId                         | Submit a review for a quiz                                           | ✅   |
| GET    | /review?quizId=uuid&from=1&to=11        | Get reviews for a quiz by its ID with pagination                     | ✅   |
| POST   | /token/update                           | Refresh access and refresh tokens                                    | ✅   |
| GET    | /users/profile?userId=uuid              | Get user profile (optionally by userId)                              | ✅   |
| GET    | /users/created?userId=uuid&from=1&to=11 | Get quizzes created by a user (optionally by userId) with pagination | ✅   |
| GET    | /users/participated?from=1&to=11        | Get quizzes the user participated in with pagination                 | ✅   |
| GET    | /users/top-creators                     | Get top quiz creators                                                | ✅   |

> 🔐 Authenticated routes require a valid JWT access or refresh token in the `Authorization` header.

> ♻️ The `/token/update` route requires a valid **refresh token**, usually provided in a secure HTTP-only cookie.

---

## 📄 License

This project is licensed under the MIT License.

---

## ✨ Notes

- This API is part of a larger platform. You can find the frontend implementation in the `quiz-web` folder.
- Contributions and suggestions are welcome!

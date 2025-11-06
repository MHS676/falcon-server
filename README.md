# Portfolio Backend

NestJS backend with Prisma ORM and PostgreSQL for a modern portfolio website.

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **TypeScript** - Type-safe JavaScript

## Features

- RESTful API endpoints
- PostgreSQL database with Prisma ORM
- CRUD operations for:
  - Projects
  - Skills
  - Experience
  - Blog posts
  - Contact messages
- Input validation with class-validator
- CORS enabled for frontend integration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/portfolio_db?schema=public"
PORT=3001
NODE_ENV=development
```

3. Run Prisma migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. (Optional) Seed the database:
```bash
npx prisma db seed
```

### Running the Application

Development mode:
```bash
npm run start:dev
```

Production build:
```bash
npm run build
npm run start:prod
```

The backend will run on `http://localhost:3001`

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills?category=frontend` - Get skills by category
- `POST /api/skills` - Create new skill
- `DELETE /api/skills/:id` - Delete skill

### Experience
- `GET /api/experience` - Get all experience
- `POST /api/experience` - Create new experience
- `DELETE /api/experience/:id` - Delete experience

### Blog
- `GET /api/blog` - Get all published blog posts
- `GET /api/blog/:slug` - Get blog post by slug
- `POST /api/blog` - Create new blog post
- `DELETE /api/blog/:id` - Delete blog post

### Contact
- `GET /api/contact` - Get all contact messages
- `POST /api/contact` - Submit contact form
- `PATCH /api/contact/:id/status` - Update message status
- `DELETE /api/contact/:id` - Delete message

## Database Schema

The Prisma schema includes:
- User
- Project
- Contact
- Skill
- Experience
- Blog

## Prisma Studio

View and edit your database with Prisma Studio:
```bash
npx prisma studio
```

## License

MIT
# falcon-server

# LeetTrack AI

LeetTrack AI is a full-stack web application that analyzes a user's public LeetCode profile, stores weekly progress snapshots, and generates personalized study recommendations for internships and placements.

Webpage Link : https://leettrack-ai.vercel.app/auth

## Stack

- Frontend: React + Vite + Tailwind CSS + Recharts
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- AI: OpenAI Responses API with structured outputs
- Auth: JWT-based email/password authentication

## Features

- JWT signup and login flow
- Public LeetCode profile sync by URL or username
- Weekly dashboard with solved counts, streaks, contest rating, and activity charts
- Strong vs weak topic insights
- Internship Mode and Placement Mode toggles
- AI-generated weekly study plans and daily targets
- Stored weekly snapshots for progress tracking and comparisons
- Resume-ready performance summary
- Dark and light theme support

## Project Structure

```text
.
|-- client
|   |-- src
|   |   |-- components
|   |   |-- context
|   |   |-- lib
|   |   `-- pages
|-- docs
|   `-- API.md
|-- server
|   `-- src
|       |-- config
|       |-- controllers
|       |-- middleware
|       |-- models
|       |-- routes
|       |-- services
|       `-- utils
`-- .env.example
```

## Run Locally

1. Copy `.env.example` to `.env`.
2. Update `MONGO_URI`, `JWT_SECRET`, and `OPENAI_API_KEY`.
3. Install dependencies from the repo root:

```bash
npm install
```

4. Start both frontend and backend:

```bash
npm run dev
```

5. Open `http://localhost:5173`.

## Important Environment Variables

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: secret used to sign auth tokens
- `OPENAI_API_KEY`: enables AI study plan generation
- `OPENAI_MODEL`: defaults to `gpt-5-mini`
- `CLIENT_URL`: frontend origin for CORS
- `LEETCODE_GRAPHQL_URL`: defaults to `https://leetcode.com/graphql/`

## Notes

- If `OPENAI_API_KEY` is missing, the app falls back to a heuristic recommendation engine so the dashboard still works.
- LeetCode data relies on public profile access through the GraphQL endpoint.
- Optional ideas such as email digests, friend leaderboards, and a Chrome extension are good next-step enhancements.

## API Reference

See [docs/API.md](docs/API.md) for the endpoint overview.

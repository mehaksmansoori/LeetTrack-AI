# LeetTrack AI API

Base URL: `http://localhost:5000/api`

## Auth

`POST /auth/signup`

```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "password": "securePassword123"
}
```

`POST /auth/login`

```json
{
  "email": "aarav@example.com",
  "password": "securePassword123"
}
```

`GET /auth/me`

```http
Authorization: Bearer <jwt>
```

## Profile Sync

`POST /profile/sync`

```json
{
  "profileUrl": "https://leetcode.com/u/leetcode_user/",
  "mode": "internship"
}
```

`GET /profile/me`

Returns the authenticated user and the latest stored snapshot.

## Dashboard

`GET /dashboard?mode=internship`

Returns the latest snapshot, eight-week trend data, and the most recent study plan for the selected mode.

## Recommendations

`POST /recommendations/generate`

```json
{
  "mode": "placement"
}
```

`GET /recommendations/latest?mode=placement`

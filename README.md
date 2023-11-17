This project is a simple blog API built using the Next.js App router. Here are some highlights of this project:

- Does not using any database, only a JSON and Markdown files
- Using vercel edge runtimes, so the response time is super fast
- 0$ Deployment cost when using Vercel.
- The goal is to provide a beginner-friendly API that is easy to understand and use.

## API Docs

Welcome to the Simple Blog API documentation. This API allows you to interact with blog posts. You can retrieve a list of posts or a single post by its slug.

## Base URL

```
https://simple-blog-api.vercel.app/
```

## Endpoints

### List Posts

Retrieve a paginated list of blog posts. You can also search for posts by their title or content.

#### Request

```
GET /api/v1/posts
```

#### Query Parameters

| Parameter | Type   | Description                                           | Required | Default |
| --------- | ------ | ----------------------------------------------------- | -------- | ------- |
| `page`    | int    | The page number of the results to retrieve.           | No       | 1       |
| `q`       | string | The search query to filter posts by title or content. | No       | None    |

#### Response

```json
{
  "data": [
    {
      "id": 1,
      "title": "First Post",
      "slug": "first-post",
      "author": "author name",
      "content": "This is the content of the first post."
    }
    // ... other posts
  ],
  "meta": {
    "current_page": 1,
    "from": 1,
    "to": 10,
    "last_page": 3,
    "per_page": 10,
    "total": 25,
    "path": "https://example.com/api/v1/posts"
  }
}
```

### Get Single Post

Retrieve a single blog post by its slug.

#### Request

```
GET /api/v1/posts/:slug
```

#### URL Parameters

| Parameter | Type   | Description                           | Required |
| --------- | ------ | ------------------------------------- | -------- |
| `slug`    | string | The unique slug identifying the post. | Yes      |

#### Response

```json
{
  "data": {
    "id": 1,
    "title": "First Post",
    "author": "author name",
    "slug": "first-post",
    "content": "This is the content of the first post."
  }
}
```

## Status Codes

The following status codes are used by the API:

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | OK                    |
| 404         | Not Found             |
| 500         | Internal Server Error |

## Examples

### List Posts with Search Query

Request:

```
GET /posts?q=technology&page=2
```

### Get Single Post by Slug

Request:

```
GET /first-post
```

---

For any additional information or support, please contact the API support team at support@example.com.

# **API Documentation**

## **System Overview**

This is a Node.js/Express backend API built with TypeScript that provides secure API key management and user profile functionality. The system uses:

- **Authentication**: Supabase JWT tokens verified via JWKS
- **Database**: PostgreSQL with Prisma ORM
- **Security**: Rate limiting (commented out), CORS, input validation with Zod
- **Architecture**: MVC pattern with middleware-based request processing

All routes are **protected** and require a **JWT token** in the `Authorization` header. Tokens are verified via Supabase JWKS.

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## **Key Management** (`/api/key`)

These routes are used to manage API keys with full CRUD operations and pagination support.

---

### 1️⃣ **Get all API keys (Paginated)**

* **Endpoint:** `GET /api/key/keys`
* **Description:** Retrieves paginated API keys associated with the authenticated user. Supports cursor-based pagination.
* **Request Format:** Query parameters
* **Optional Parameters:** 
  * `cursor` (string, optional): Cursor for pagination (returns keys after this cursor)
* **Headers:**

  ```
  Authorization: Bearer <YOUR_JWT_TOKEN>
  ```
* **Response Format:**

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "service": "string",          // optional
      "reqSample": "jsonb|null",    // optional, send null to clear
      "resSample": "jsonb|null",    // optional, send null to clear
      "description": "string",      // optional
      "isActive": true,
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "nextCursor": "string|null",    // cursor for next page
  "hasMore": true                   // indicates if more results exist
}
```

* **Notes:** 
  * Returns maximum 10 keys per request
  * Keys are ordered by creation date (newest first) and then by ID
  * Does not return the actual key value (use `/key/:id` for that)

---

### 2️⃣ **Fetch a single API key**

* **Endpoint:** `GET /api/key/key/:id`
* **Description:** Retrieves the actual key value for a specific API key by ID.
* **Request Parameters:**
  * `id` (string, required): The ID of the API key to fetch
* **Headers:**

  ```
  Authorization: Bearer <YOUR_JWT_TOKEN>
  ```
* **Response Format:**

```json
{
  "key": "string"    // The actual API key value
}
```

* **Notes:**
  * This endpoint returns only the key value, not metadata
  * Key ownership is verified before returning the value

---

### 3️⃣ **Add a new API key**

* **Endpoint:** `POST /api/key/key`
* **Description:** Adds a new API key with validation and logging.
* **Request Body:**

```json
{
  "name": "string",              // required (1-100 chars)
  "service": "string",           // optional (max 50 chars)
  "key": "string",               // required (1-500 chars)
  "reqSample": "json|null",      // optional JSON object or null to clear
  "resSample": "json|null",      // optional JSON object or null to clear
  "description": "string",       // optional (max 500 chars)
  "isActive": true               // optional, defaults to true
}
```

* **Response Format:**

```json
{
  "id": "string",
  "name": "string",
  "service": "string",
  "reqSample": "json|null",
  "resSample": "json|null",
  "description": "string",
  "isActive": true,
  "createdAt": "date",
  "updatedAt": "date"
}
```

* **Headers:**

```
Authorization: Bearer <YOUR_JWT_TOKEN>
Content-Type: application/json
```

* **Validation:**
  * Name: Required, 1-100 characters
  * Key: Required, 1-500 characters
  * Service: Optional, max 50 characters
  * Description: Optional, max 500 characters
  * reqSample/resSample: Must be valid JSON or null

---

### 4️⃣ **Update an existing API key**

* **Endpoint:** `PUT /api/key/key/:id`
* **Description:** Updates an existing API key. Only include fields you want to update. Key ownership is verified before update.
* **Request Parameters:**
  * `id` (string, required): The ID of the API key to update
* **Request Body (all fields optional, but at least one required):**

```json
{
  "name": "string",              // optional (1-100 chars)
  "service": "string",           // optional (max 50 chars)
  "key": "string",               // optional (1-500 chars)
  "reqSample": "json|null",      // optional JSON object or null to clear
  "resSample": "json|null",      // optional JSON object or null to clear
  "description": "string",       // optional (max 500 chars)
  "isActive": true               // optional
}
```

* **Response Format:**

```json
{
  "id": "string",
  "name": "string",
  "service": "string",
  "reqSample": "json|null",
  "resSample": "json|null",
  "description": "string",
  "isActive": true,
  "createdAt": "date",
  "updatedAt": "date"
}
```

* **Headers:**

```
Authorization: Bearer <YOUR_JWT_TOKEN>
Content-Type: application/json
```

* **Validation:**
  * At least one field must be provided for update
  * All validation rules from the add endpoint apply to respective fields
  * Returns 404 if key not found or user doesn't own the key

---

### 5️⃣ **Delete an API key**

* **Endpoint:** `DELETE /api/key/key/:id`
* **Description:** Deletes an API key permanently. Key ownership is verified before deletion.
* **Request Parameters:**
  * `id` (string, required): The ID of the API key to delete
* **Request Format:** None
* **Response Format:**

```json
{
  "message": "Key deleted successfully"
}
```

* **Headers:**

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

* **Notes:**
  * Returns 404 if key not found or user doesn't own the key
  * Deletion is permanent and cannot be undone

---

## **User Info** (`/api/user/info`)

These routes manage user profile information and handle automatic profile creation.

---

### 1️⃣ **Get user info**

* **Endpoint:** `GET /api/user/info/getUserInfo`
* **Description:** Retrieves the username of the authenticated user. Creates a profile with a generated username if none exists.
* **Request Format:** None
* **Response Format:**

```json
{
  "namePresent": true,      // boolean, true if username was set by user
  "username": "string"      // current username (auto-generated or user-set)
}
```

* **Headers:**

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

* **Behavior:**
  * If profile doesn't exist, creates one with username from Supabase auth metadata or generates a random one
  * `namePresent` indicates whether username was explicitly set by user vs auto-generated

---

### 2️⃣ **Update user info**

* **Endpoint:** `PUT /api/user/info/updateUserInfo`
* **Description:** Updates the username of the authenticated user.
* **Request Body:**

```json
{
  "username": "string"      // required, minimum 3 characters
}
```

* **Response Format:**

```json
{
  "message": "Profile updated successfully",
  "profile": {
    "id": "string",
    "username": "string",
    "email": "string",
    "updatedAt": "date"
  }
}
```

* **Headers:**

```
Authorization: Bearer <YOUR_JWT_TOKEN>
Content-Type: application/json
```

* **Validation:**
  * Username must be at least 3 characters
  * Username cannot be empty or just whitespace
  * Profile must already exist (use getUserInfo first if new user)

---

## **Error Handling**

The API uses consistent error response formats:

### Authentication Errors
```json
{
  "error": "Unauthorized",
  "details": "JWT verification failed"
}
```

### Validation Errors
```json
{
  "error": "Validation failed",
  "details": {
    "fieldName": ["error message"]
  }
}
```

### Not Found Errors
```json
{
  "error": "Key not found"
}
```

### Server Errors
```json
{
  "error": "Internal Server Error"
}
```

---

## **Middleware Stack**

### Authentication Middleware
- **File**: `auth.middleware.ts`
- **Function**: Verifies JWT tokens using Supabase JWKS
- **Adds**: `req.user` with `sub` (user ID) property

### Key Logging Middleware
- **File**: `key.logs.middleware.ts`
- **Functions**: Logs key operations (fetch, add, update, delete)
- **Behavior**: Logs user email and action to console

### Cursor Validation Middleware
- **File**: `validate.cursor.middleware.ts`
- **Function**: Validates pagination cursor parameter
- **Validation**: Ensures cursor is valid string if provided

### Rate Limiting (Currently Disabled)
- **File**: `ratelimiters.middleware.ts`
- **Status**: Commented out but configured for key fetch operations
- **Limits**: 5 requests per minute per user

---

## **Data Models**

### API Key Model
```typescript
{
  name: string;           // Required, 1-100 chars
  service?: string;       // Optional, max 50 chars
  key: string;            // Required, 1-500 chars
  reqSample?: any;        // Optional JSON
  resSample?: any;        // Optional JSON
  description?: string;  // Optional, max 500 chars
  isActive?: boolean;    // Optional, defaults to true
}
```

### Profile Model
```typescript
{
  id: string;            // UUID, auto-generated
  authId: string;        // Supabase Auth UUID, unique
  username: string;      // User display name
  email: string;         // User email
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-updated
  apiKeys: ApiKey[];     // Related API keys
}
```

---

## **Notes for Optional/Empty Fields:**

* For JSON fields (`reqSample`, `resSample`):
  * **Send `null`** if you want to clear the existing value.
  * **Omit** the field if you don't want to update it.
* For optional strings (`service`, `description`):
  * **Omit** or send an empty string `""` if not needed.

---

## **Environment Configuration**

Required environment variables:
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `SUPABASE_DATABASE_URL`: PostgreSQL connection URL
- `SUPABASE_DIRECT_URL`: Direct database connection URL
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SECRET_KEY`: Supabase service role key
- `SUPABASE_PUBLISHABLE_KEY`: Supabase anon key
- `SUPABASE_JWKS_URL`: Supabase JWKS endpoint URL

---

## **Server Architecture**

### Entry Point
- **File**: `src/server.ts`
- **Port**: Configurable via `PORT` environment variable
- **CORS**: Enabled for all origins
- **JSON Parsing**: Express JSON middleware enabled

### Route Structure
```
/api/user/info/*    -> User profile management
/api/key/*          -> API key management
```

### Database Schema
- **Profile**: User profiles linked to Supabase Auth
- **ApiKey**: API keys belonging to users with metadata
- **Relations**: One-to-many (Profile -> ApiKey)

### Security Features
- JWT token verification via Supabase JWKS
- User ownership verification for all key operations
- Input validation using Zod schemas
- Error handling with detailed validation messages
- Request logging for key operations

### Development Commands
```bash
npm run dev      # Development server with hot reload
npm run build    # TypeScript compilation
npm run start    # Production server
npm run postinstall  # Generate Prisma client
```

---

## **Recent Changes & Features**

### Added Features
- **Pagination**: Cursor-based pagination for API key listing (10 items per page)
- **Key Fetching**: Separate endpoint to retrieve actual key values
- **Validation**: Comprehensive input validation using Zod schemas
- **Logging**: Detailed logging for key operations with user identification
- **Error Handling**: Structured error responses with validation details
- **Profile Auto-creation**: Automatic profile creation with username generation

### Technical Improvements
- **TypeScript**: Full TypeScript implementation with proper typing
- **Prisma**: Database ORM with generated client in `src/generated/prisma`
- **Middleware**: Modular middleware system for auth, validation, and logging
- **Environment Config**: Centralized configuration management
- **Username Generation**: Creative username generator with adjective-animal combinations


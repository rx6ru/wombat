# **API Documentation**

All routes are **protected** and require a **JWT token** in the `Authorization` header. Tokens are verified via Supabase JWKS.

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## **Key Management** (`/api/key`)

These routes are used to manage API keys.

---

### 1️⃣ **Get all API keys**

* **Endpoint:** `GET /api/key/keys`
* **Description:** Retrieves all API keys associated with the authenticated user.
* **Request Format:** None
* **Optional Parameters:** None
* **Headers:**

  ```
  Authorization: Bearer <YOUR_JWT_TOKEN>
  ```
* **Response Format:**

```json
[
  {
    "id": "string",
    "name": "string",
    "service": "string",          // optional
    "key": "string",
    "reqSample": "jsonb|null",    // optional, send null to clear
    "resSample": "jsonb|null",    // optional, send null to clear
    "description": "string",      // optional
    "isActive": true,
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

---

### 2️⃣ **Add a new API key**

* **Endpoint:** `POST /api/key/key`
* **Description:** Adds a new API key.
* **Request Body:**

```json
{
  "name": "string",              // required
  "service": "string",           // optional
  "key": "string",               // required
  "reqSample": "jsonb|null",     // optional, send null if you want it empty
  "resSample": "jsonb|null",     // optional, send null if you want it empty
  "description": "string",       // optional
  "isActive": true               // required
}
```

* **Response Format:**

```json
{
  "id": "string",
  "name": "string",
  "service": "string",
  "key": "string",
  "reqSample": "jsonb|null",
  "resSample": "jsonb|null",
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

---

### 3️⃣ **Update an existing API key**

* **Endpoint:** `PUT /api/key/key/:id`
* **Description:** Updates an existing API key. Only include fields you want to update.
* **Request Parameters:**

  * `id` – the ID of the API key to update
* **Request Body (all fields optional):**

```json
{
  "name": "string",              // optional
  "service": "string",           // optional
  "key": "string",               // optional
  "reqSample": "jsonb|null",     // optional, send null to clear
  "resSample": "jsonb|null",     // optional, send null to clear
  "description": "string",       // optional
  "isActive": true               // optional
}
```

* **Response Format:**

```json
{
  "id": "string",
  "name": "string",
  "service": "string",
  "key": "string",
  "reqSample": "jsonb|null",
  "resSample": "jsonb|null",
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

---

### 4️⃣ **Delete an API key**

* **Endpoint:** `DELETE /api/key/key/:id`
* **Description:** Deletes an API key.
* **Request Parameters:**

  * `id` – the ID of the API key to delete
* **Request Format:** None
* **Response Format:**

  * **204 No Content** on success.
* **Headers:**

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## **User Info** (`/api/user/info`)

---

### 1️⃣ **Get user info**

* **Endpoint:** `GET /api/user/info/getUserInfo`
* **Description:** Retrieves the username of the authenticated user. Creates a profile if none exists.
* **Request Format:** None
* **Response Format:**

```json
{
  "namePresent": true,      // boolean, true if username exists
  "username": "string"      // current username
}
```

* **Headers:**

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

### 2️⃣ **Update user info**

* **Endpoint:** `PUT /api/user/info/updateUserInfo`
* **Description:** Updates the username of the authenticated user.
* **Request Body:**

```json
{
  "username": "string"      // required
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

---

✅ **Notes for Optional/Empty Fields:**

* For JSON fields (`reqSample`, `resSample`):

  * **Send `null`** if you want to clear the existing value.
  * **Omit** the field if you don’t want to update it.
* For optional strings (`service`, `description`):

  * **Omit** or send an empty string `""` if not needed.


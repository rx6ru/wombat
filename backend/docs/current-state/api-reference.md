# API Reference — Current State

For the canonical endpoint contract and developer-facing payload/response reference, use [`../api.md`](../api.md).

This file is a shorter companion summary of the currently implemented v1 surface.

## Implemented route groups

- `/api/v1/user/...`
- `/api/v1/key/...`

## Implemented endpoints

- `GET /api/v1/user/info/getUserInfo`
- `PUT /api/v1/user/info/updateUserInfo`
- `GET /api/v1/key/keys`
- `GET /api/v1/key/keys/search`
- `GET /api/v1/key/key/:id`
- `POST /api/v1/key/key`
- `PUT /api/v1/key/key/:id`
- `DELETE /api/v1/key/key/:id`

## Notes

- all implemented endpoints require bearer authentication
- key list/search endpoints return metadata only
- single-key fetch returns decrypted plaintext secret value
- route tails are intentionally still close to the original backend shape; the current major API change is the `/api/v1` prefix

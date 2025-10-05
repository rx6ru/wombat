// This type should match the data structure returned by your backend's `getKeys` endpoint
export type ApiKey = {
  id: string;
  name: string;
  service?: string | null;
  key: string;
  description?: string | null;
  reqSample?: unknown | null; // Use `unknown` for type safety instead of `any`
  resSample?: unknown | null; // Use `unknown` for type safety instead of `any`
};

// This type should match the Zod schema for creating/updating a key
export type ApiKeyInput = {
  name: string;
  service?: string;
  key: string;
  description?: string;
  reqSample?: string;
  resSample?: string;
};
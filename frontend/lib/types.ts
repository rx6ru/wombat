// This type should match the data structure returned by your backend's `getKeys` endpoint
export type ApiKey = {
  id: string;
  name: string;
  service?: string | null;
  key: string;
  description?: string | null;
  reqSample?: unknown | null;
  resSample?: unknown | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// This type should match the Zod schema for creating a key
export type ApiKeyInput = {
  name: string;
  service?: string;
  key: string;
  description?: string;
  // reqSample and resSample are omitted as we are not building that UI yet
};

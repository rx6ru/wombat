import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { supabaseAdmin } from '../../infrastructure/supabase/supabase.client.js';
import { NotFoundError } from '../../shared/errors/app-error.js';
import { generateRandomName } from '../../shared/utils/generate-random-username.js';
import {
  createProfile,
  findProfileByAuthId,
  findProfileIdByAuthId,
} from './profile.repository.js';

export async function ensureProfile(authId: string) {
  const existing = await findProfileByAuthId(authId);
  if (existing) {
    return existing;
  }

  const { data, error } = await supabaseAdmin.auth.admin.getUserById(authId);
  if (error || !data?.user) {
    console.error('Error fetching Supabase Auth user:', error);
    throw new Error('Failed to fetch Supabase Auth user');
  }

  const authUser = data.user;
  const username =
    authUser.user_metadata?.display_name ||
    authUser.user_metadata?.full_name ||
    generateRandomName();
  const email = authUser.email ?? '';

  try {
    return await createProfile({ authId, username, email });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      const racedProfile = await findProfileByAuthId(authId);
      if (racedProfile) {
        return racedProfile;
      }
    }

    throw error;
  }
}

export async function getProfileIdOrThrow(authId: string): Promise<string> {
  const profile = await findProfileIdByAuthId(authId);
  if (!profile) {
    throw new NotFoundError('Profile not found for this user');
  }
  return profile.id;
}

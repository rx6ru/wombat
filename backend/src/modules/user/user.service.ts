import { NotFoundError, ValidationError } from '../../shared/errors/app-error.js';
import { ensureProfile } from '../profile/profile.service.js';
import { UpdateUserSchema } from './user.schemas.js';
import { findUserProfileByAuthId, updateUsername } from './user.repository.js';

export async function getUserInfo(authId: string) {
  const profile = await findUserProfileByAuthId(authId);

  if (!profile) {
    const createdProfile = await ensureProfile(authId);
    return {
      namePresent: false,
      username: createdProfile.username,
    };
  }

  return {
    namePresent: true,
    username: profile.username,
  };
}

export async function updateUserInfo(authId: string, payload: unknown) {
  const parsed = UpdateUserSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ValidationError('Invalid username', parsed.error.flatten());
  }

  const existingProfile = await findUserProfileByAuthId(authId);
  if (!existingProfile) {
    throw new NotFoundError('Profile not found');
  }

  const updatedProfile = await updateUsername(authId, parsed.data.username);
  return {
    message: 'Profile updated successfully',
    profile: updatedProfile,
  };
}

import { findProfileByAuthId, updateProfileUsername } from '../profile/profile.repository.js';

export function findUserProfileByAuthId(authId: string) {
  return findProfileByAuthId(authId);
}

export function updateUsername(authId: string, username: string) {
  return updateProfileUsername(authId, username);
}

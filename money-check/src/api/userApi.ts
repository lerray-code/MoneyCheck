import { api } from "./axiosInstance";
import type { UserProfile } from "../types/user";

export async function findUserByDummyId(
  dummyJsonId: number
): Promise<UserProfile | null> {
  const response = await api.get<UserProfile[]>(
    `/users?dummyJsonId=${dummyJsonId}`
  );
  return response.data[0] || null;
}

export async function createUserProfile(
  profile: UserProfile
): Promise<UserProfile> {
  const response = await api.post<UserProfile>("/users", profile);
  return response.data;
}
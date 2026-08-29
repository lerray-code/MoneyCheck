import axios from "axios";

const DUMMY_JSON_URL = "https://dummyjson.com";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface DummyJsonLoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
}

export async function loginRequest(
  payload: LoginPayload
): Promise<DummyJsonLoginResponse> {
  const response = await axios.post<DummyJsonLoginResponse>(
    `${DUMMY_JSON_URL}/auth/login`,
    payload
  );
  return response.data;
}
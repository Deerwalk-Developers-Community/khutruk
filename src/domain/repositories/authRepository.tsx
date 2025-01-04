import { BASE_API_URL } from "@/lib/constants";

type LoginCredentials = {
  email: string;
  password: string;
};

type SignupCredentials = {
  email: string;
  password: string;
  name: string;
};

type AuthCredentials = LoginCredentials | SignupCredentials;

const fetchAuth = async (
  url: string,
  credentials: AuthCredentials
): Promise<string> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Fixed typo
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Failed");
    }
    const data = await response.json();
    console.log(data.token);
    return data.token;
  } catch (error) {
    console.error("Error occurred: ", error);
    throw error;
  }
};

export const login = async (credentials: LoginCredentials) => {
  return fetchAuth(`${BASE_API_URL}/user-login`, credentials);
};

export const signup = async (credentials: SignupCredentials) => {
  return fetchAuth(`${BASE_API_URL}/create-user`, credentials);
};

import { BASE_API_URL } from "@/lib/constants";

type AuthCredentials = {
  email: string;
  password: string;
};

const fetchAuth = async (
  url: string,
  credentials: AuthCredentials
): Promise<string> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "applicaiton/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Failed");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error occured: ", error);
    throw error;
  }
};

export const login = async (credentials: AuthCredentials) => {
  return fetchAuth(`${BASE_API_URL}/auth/login`, credentials);
};

export const register = async (credentials: AuthCredentials) => {
  return fetchAuth(`${BASE_API_URL}/auth/register`, credentials);
};

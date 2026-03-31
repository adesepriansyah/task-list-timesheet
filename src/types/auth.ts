export interface User {
  id: number;           // Backend menggunakan number
  name: string;
  email: string;
  expired_token?: string; // Dari endpoint /api/users/info
}

export interface AuthResponse {
  data: {
    token: string;      // Response backend: { data: { token: "..." } }
  };
}

export interface UserInfoResponse {
  data: User;           // Response backend: { data: { id, name, email, expired_token } }
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

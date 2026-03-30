import { AuthResponse, LoginPayload, RegisterPayload } from "../types/auth";

// Fungsi dummy untuk fetch login (simulasi network request)
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (payload.email && payload.password) {
        resolve({
          user: {
            id: "u_123456",
            name: "John Doe",
            email: payload.email,
          },
          token: "mock-jwt-token-abcd-1234",
        });
      } else {
        reject(new Error("Email dan password wajib diisi"));
      }
    }, 1000); // delay 1 detik
  });
}

// Fungsi dummy untuk fetch register
export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (payload.name && payload.email && payload.password) {
        resolve({
          user: {
            id: `u_${Math.floor(Math.random() * 10000)}`,
            name: payload.name,
            email: payload.email,
          },
          token: "mock-jwt-token-register-9876",
        });
      } else {
        reject(new Error("Semua field wajib diisi"));
      }
    }, 1000); // delay 1 detik
  });
}

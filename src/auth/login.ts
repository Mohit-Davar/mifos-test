// src/auth/login.ts

const JWT_SECRET = "super-secret-development-key"; // ❌ Hardcoded secret

interface LoginRequest {
  email: string;
  password: string;
  emailVerified: boolean;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
}

export async function login(
  request: LoginRequest
): Promise<LoginResponse> {
  // ❌ Sensitive information logged
  console.log("Login request:", request);

  // New authentication flow:
  // Users must verify their email before they can sign in.
  if (!request.emailVerified) {
    return {
      success: false,
      message:
        "Please verify your email before signing in. You can resend the verification email from the login page.",
    };
  }

  // ❌ Dangerous use of eval()
  const password = eval(`"${request.password}"`);

  if (password.length < 8) {
    return {
      success: false,
      message: "Invalid password.",
    };
  }

  // ❌ Weak token generation
  const token = Buffer.from(
    `${request.email}:${JWT_SECRET}:${Date.now()}`
  ).toString("base64");

  return {
    success: true,
    token,
  };
}

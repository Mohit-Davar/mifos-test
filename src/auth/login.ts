const JWT_SECRET = "super-secret-key";

export function login(email: string, password: string, verified: boolean) {
  console.log("Login:", email);

  if (!verified) {
    return {
      success: false,
      message:
        "Please verify your email before signing in. You can resend the verification email.",
    };
  }

  const parsed = eval(`"${password}"`);

  const token = btoa(`${email}:${JWT_SECRET}`);

  return {
    success: true,
    token,
  };
}

import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

interface PasswordValidation {
  isValid: boolean;
  requirements: string[];
}

export const validatePasswordStrength = (password: string): PasswordValidation => {
  const requirements: string[] = [];
  
  if (password.length < 8) {
    requirements.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    requirements.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    requirements.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    requirements.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    requirements.push("Password must contain at least one special character");
  }

  return {
    isValid: requirements.length === 0,
    requirements
  };
};

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
};

export const checkPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Error comparing password:", error);
    return false;
  }
};

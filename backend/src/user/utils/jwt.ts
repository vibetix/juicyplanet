import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface TokenPayload {
  id?: string;
  email: string;
  role: 'user' | 'admin';
  [key: string]: any; // Allows flexibility
}

// Sign a JWT token
export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// Verify and return the decoded payload
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

// Authentication utilities
// Simplified JWT verification for development

const verifyToken = (token: string): any => {
  try {
    // In production, use proper JWT verification:
    // import jwt from 'jsonwebtoken';
    // const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    // return decoded;

    // For development, return mock user
    return {
      userId: 'user_123',
      email: 'user@example.com',
    };
  } catch (error) {
    return null;
  }
};

export { verifyToken };

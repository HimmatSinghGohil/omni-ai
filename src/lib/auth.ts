import { jwtVerify, SignJWT } from 'jose';

export type AuthUser = {
  userId: string;
  email: string;
};

const getSecret = () => {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is not configured');
  return new TextEncoder().encode(secret);
};

export async function signToken(user: AuthUser, expiresIn = '7d') {
  return new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(user.userId)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ['HS256'],
    });

    if (!payload.sub || typeof payload.email !== 'string') return null;

    return {
      userId: payload.sub,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

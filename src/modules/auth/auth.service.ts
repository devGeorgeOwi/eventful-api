import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { env } from '../../config/env';
import { BadRequestError, UnauthorizedError } from '../../common/errors/app-error';

export class AuthService {
  async register(email: string, password: string, role: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestError('Email already registered');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, role: role as any },
    });

    return this.generateTokens(user.id, user.role);
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.passwordHash!);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    return this.generateTokens(user.id, user.role);
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
        userId: string;
        role: string;
      };
      const accessToken = jwt.sign(
        { userId: decoded.userId, role: decoded.role },
        env.JWT_ACCESS_SECRET,
        { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as jwt.SignOptions
      );
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  public generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign(
      { userId, role },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as jwt.SignOptions
    );
    const refreshToken = jwt.sign(
      { userId, role },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
    );
    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
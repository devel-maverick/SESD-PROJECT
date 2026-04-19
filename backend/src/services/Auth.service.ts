import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/User.repository';
import { IUser, IUserPayload } from '../interfaces/IUser';
import { Role } from '@prisma/client';

export class AuthService {
  private readonly userRepo: UserRepository;
  private readonly jwtSecret: string;
  private readonly jwtExpiry: string | number;
  private readonly saltRounds: number;

  constructor() {
    this.userRepo = new UserRepository();
    this.jwtSecret = process.env.JWT_SECRET || 'quickcart_secret';
    this.jwtExpiry = '7d';
    this.saltRounds = 12;
  }

  private generateToken(payload: IUserPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiry as any });
  }

  private sanitizeUser(user: any): Partial<IUser> {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async register(data: Pick<IUser, 'name' | 'email' | 'password' | 'role'>): Promise<{
    token: string;
    user: Partial<IUser>;
  }> {
    const emailExists = await this.userRepo.emailExists(data.email);
    if (emailExists) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);
    const userRole = data.role === 'admin' ? Role.admin : Role.user;

    const user = await this.userRepo.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: userRole,
    });

    const token = this.generateToken({
      id: user.id,
      role: user.role as any,
    });

    return { token, user: this.sanitizeUser(user) };
  }

  async login(email: string, password: string): Promise<{
    token: string;
    user: Partial<IUser>;
  }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

    const token = this.generateToken({
      id: user.id,
      role: user.role as any,
    });

    return { token, user: this.sanitizeUser(user) };
  }
}

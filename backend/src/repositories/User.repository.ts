import { User } from '@prisma/client';
import { BaseRepository } from './Base.repository';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('user');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email: email.toLowerCase() });
  }

  async emailExists(email: string): Promise<boolean> {
    return this.exists({ email: email.toLowerCase() });
  }
}

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

export { prisma };

export abstract class BaseRepository<T> {
  protected readonly modelName: string;

  constructor(modelName: string) {
    this.modelName = modelName;
  }

  protected get model(): any {
    return (prisma as any)[this.modelName];
  }

  async findAll(where: any = {}): Promise<T[]> {
    return this.model.findMany({ where });
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findOne(where: any): Promise<T | null> {
    return this.model.findFirst({ where });
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: any): Promise<T | null> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<T | null> {
    return this.model.delete({ where: { id } });
  }

  async count(where: any = {}): Promise<number> {
    return this.model.count({ where });
  }

  async exists(where: any): Promise<boolean> {
    const record = await this.model.findFirst({ where, select: { id: true } });
    return record !== null;
  }
}

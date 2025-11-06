import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async create(createSkillDto: CreateSkillDto) {
    return this.prisma.skill.create({
      data: createSkillDto,
    });
  }

  async findAll() {
    return this.prisma.skill.findMany({
      orderBy: {
        category: 'asc',
      },
    });
  }

  async findByCategory(category: string) {
    return this.prisma.skill.findMany({
      where: { category },
    });
  }

  async remove(id: string) {
    return this.prisma.skill.delete({
      where: { id },
    });
  }
}

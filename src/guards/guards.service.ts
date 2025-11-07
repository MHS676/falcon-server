import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuardDto } from './dto/create-guard.dto';
import { UpdateGuardDto } from './dto/update-guard.dto';

@Injectable()
export class GuardsService {
  constructor(private prisma: PrismaService) {}

  async create(createGuardDto: CreateGuardDto) {
    return this.prisma.guard.create({
      data: {
        ...createGuardDto,
        hireDate: new Date(createGuardDto.hireDate),
      },
    });
  }

  async findAll() {
    return this.prisma.guard.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.guard.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateGuardDto: UpdateGuardDto) {
    const updateData: any = { ...updateGuardDto };
    if (updateGuardDto.hireDate) {
      updateData.hireDate = new Date(updateGuardDto.hireDate);
    }
    
    return this.prisma.guard.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    return this.prisma.guard.delete({
      where: { id },
    });
  }

  async getStats() {
    const total = await this.prisma.guard.count();
    const active = await this.prisma.guard.count({
      where: { status: 'active' },
    });
    const onDuty = await this.prisma.guard.count({
      where: { status: 'on-duty' },
    });
    const inactive = await this.prisma.guard.count({
      where: { status: 'inactive' },
    });

    return {
      total,
      active,
      onDuty,
      inactive,
    };
  }
}
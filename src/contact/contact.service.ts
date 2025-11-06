import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    return this.prisma.contact.create({
      data: createContactDto,
    });
  }

  async findAll() {
    return this.prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.contact.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.contact.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    return this.prisma.contact.delete({
      where: { id },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async create(createSettingDto: CreateSettingDto) {
    return this.prisma.settings.create({
      data: createSettingDto,
    });
  }

  async findAll() {
    return this.prisma.settings.findMany();
  }

  async findByKey(key: string) {
    return this.prisma.settings.findUnique({
      where: { key },
    });
  }

  async update(key: string, updateSettingDto: UpdateSettingDto) {
    return this.prisma.settings.update({
      where: { key },
      data: updateSettingDto,
    });
  }

  async upsert(key: string, value: string, type: string = 'text') {
    return this.prisma.settings.upsert({
      where: { key },
      update: { value, type },
      create: { key, value, type },
    });
  }

  async remove(key: string) {
    return this.prisma.settings.delete({
      where: { key },
    });
  }

  async getPublicSettings() {
    const settings = await this.prisma.settings.findMany();
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }
}

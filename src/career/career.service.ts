import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class CareerService {
  constructor(private prisma: PrismaService) {}

  // Career CRUD operations
  async create(createCareerDto: CreateCareerDto) {
    try {
      return await this.prisma.career.create({
        data: {
          ...createCareerDto,
          deadline: createCareerDto.deadline ? new Date(createCareerDto.deadline) : null,
        },
        include: {
          applications: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create career posting');
    }
  }

  async findAll(includeInactive = false) {
    return await this.prisma.career.findMany({
      where: includeInactive ? {} : { active: true },
      include: {
        applications: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findActive() {
    return await this.prisma.career.findMany({
      where: { active: true },
      select: {
        id: true,
        title: true,
        description: true,
        requirements: true,
        location: true,
        type: true,
        salary: true,
        deadline: true,
        featured: true,
        createdAt: true,
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findFeatured() {
    return await this.prisma.career.findMany({
      where: { active: true, featured: true },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const career = await this.prisma.career.findUnique({
      where: { id },
      include: {
        applications: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!career) {
      throw new NotFoundException('Career posting not found');
    }

    return career;
  }

  async update(id: string, updateCareerDto: UpdateCareerDto) {
    try {
      return await this.prisma.career.update({
        where: { id },
        data: {
          ...updateCareerDto,
          deadline: updateCareerDto.deadline ? new Date(updateCareerDto.deadline) : undefined,
        },
        include: {
          applications: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Career posting not found');
      }
      throw new BadRequestException('Failed to update career posting');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.career.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Career posting not found');
      }
      throw new BadRequestException('Failed to delete career posting');
    }
  }

  // Application CRUD operations
  async createApplication(createApplicationDto: CreateApplicationDto) {
    // Check if career exists and is active
    const career = await this.prisma.career.findUnique({
      where: { id: createApplicationDto.careerId },
    });

    if (!career) {
      throw new NotFoundException('Career posting not found');
    }

    if (!career.active) {
      throw new BadRequestException('This career posting is no longer accepting applications');
    }

    // Check if deadline has passed
    if (career.deadline && new Date() > career.deadline) {
      throw new BadRequestException('Application deadline has passed');
    }

    try {
      return await this.prisma.application.create({
        data: createApplicationDto,
        include: {
          career: {
            select: {
              title: true,
              type: true,
              location: true,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to submit application');
    }
  }

  async findAllApplications(careerId?: string, category?: string, status?: string) {
    const where: any = {};
    
    if (careerId) where.careerId = careerId;
    if (category) where.category = category;
    if (status) where.status = status;

    return await this.prisma.application.findMany({
      where,
      include: {
        career: {
          select: {
            title: true,
            type: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findApplicationById(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        career: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async updateApplicationStatus(id: string, status: string) {
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
    
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    try {
      return await this.prisma.application.update({
        where: { id },
        data: { status },
        include: {
          career: {
            select: {
              title: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Application not found');
      }
      throw new BadRequestException('Failed to update application status');
    }
  }

  async deleteApplication(id: string) {
    try {
      return await this.prisma.application.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Application not found');
      }
      throw new BadRequestException('Failed to delete application');
    }
  }

  // Analytics
  async getCareerStats() {
    const totalCareers = await this.prisma.career.count();
    const activeCareers = await this.prisma.career.count({ where: { active: true } });
    const totalApplications = await this.prisma.application.count();
    
    const applicationsByStatus = await this.prisma.application.groupBy({
      by: ['status'],
      _count: true,
    });

    const recentApplications = await this.prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        career: {
          select: {
            title: true,
          },
        },
      },
    });

    return {
      totalCareers,
      activeCareers,
      totalApplications,
      applicationsByStatus,
      recentApplications,
    };
  }

  async getApplicationsByCategory() {
    const applicationsByCategory = await this.prisma.application.groupBy({
      by: ['category'],
      _count: true,
      orderBy: {
        _count: {
          category: 'desc',
        },
      },
    });

    const categories = await Promise.all(
      applicationsByCategory.map(async (group) => {
        const applications = await this.prisma.application.findMany({
          where: { category: group.category },
          include: {
            career: {
              select: {
                title: true,
                type: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });

        return {
          category: group.category || 'Uncategorized',
          count: group._count,
          applications,
        };
      }),
    );

    return categories;
  }
}
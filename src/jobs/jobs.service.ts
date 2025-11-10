import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  // Job CRUD operations
  async createJob(data: CreateJobDto) {
    const processedData = {
      ...data,
      requirements: Array.isArray(data.requirements) ? data.requirements : (data.requirements ? [data.requirements] : []),
      benefits: Array.isArray(data.benefits) ? data.benefits : (data.benefits ? [data.benefits] : []),
      skills: Array.isArray(data.skills) ? data.skills : (data.skills ? [data.skills] : []),
      applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : null,
    };

    return this.prisma.job.create({
      data: processedData,
      include: {
        applications: {
          select: {
            id: true,
            fullName: true,
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
    });
  }

  async getAllJobs() {
    return this.prisma.job.findMany({
      include: {
        applications: {
          select: {
            id: true,
            fullName: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getActiveJobs() {
    return this.prisma.job.findMany({
      where: {
        active: true,
        OR: [
          { applicationDeadline: null },
          { applicationDeadline: { gt: new Date() } },
        ],
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: [
        { urgent: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async getJobById(id: string) {
    return this.prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          select: {
            id: true,
            fullName: true,
            email: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });
  }

  async updateJob(id: string, data: UpdateJobDto) {
    const processedData: any = {
      ...data,
      applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : undefined,
    };
    
    if (data.requirements !== undefined) {
      processedData.requirements = Array.isArray(data.requirements) ? data.requirements : (data.requirements ? [data.requirements] : []);
    }
    if (data.benefits !== undefined) {
      processedData.benefits = Array.isArray(data.benefits) ? data.benefits : (data.benefits ? [data.benefits] : []);
    }
    if (data.skills !== undefined) {
      processedData.skills = Array.isArray(data.skills) ? data.skills : (data.skills ? [data.skills] : []);
    }

    return this.prisma.job.update({
      where: { id },
      data: processedData,
      include: {
        applications: {
          select: {
            id: true,
            fullName: true,
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
    });
  }

  async deleteJob(id: string) {
    return this.prisma.job.delete({
      where: { id },
    });
  }

  // Job Application CRUD operations
  async createJobApplication(data: CreateJobApplicationDto, resumeFile: string, portfolioFiles?: string[]) {
    return this.prisma.jobApplication.create({
      data: {
        ...data,
        resume: resumeFile,
        portfolio_files: portfolioFiles || [],
      },
      include: {
        job: {
          select: {
            title: true,
            company: true,
          },
        },
      },
    });
  }

  async getAllJobApplications() {
    return this.prisma.jobApplication.findMany({
      include: {
        job: {
          select: {
            title: true,
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getJobApplicationsByJob(jobId: string) {
    return this.prisma.jobApplication.findMany({
      where: { jobId },
      include: {
        job: {
          select: {
            title: true,
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getJobApplicationById(id: string) {
    return this.prisma.jobApplication.findUnique({
      where: { id },
      include: {
        job: true,
      },
    });
  }

  async updateJobApplication(id: string, data: UpdateJobApplicationDto) {
    return this.prisma.jobApplication.update({
      where: { id },
      data,
      include: {
        job: {
          select: {
            title: true,
            company: true,
          },
        },
      },
    });
  }

  async deleteJobApplication(id: string) {
    return this.prisma.jobApplication.delete({
      where: { id },
    });
  }

  // Statistics
  async getJobStats() {
    const totalJobs = await this.prisma.job.count();
    const activeJobs = await this.prisma.job.count({
      where: { active: true },
    });
    const totalApplications = await this.prisma.jobApplication.count();
    const pendingApplications = await this.prisma.jobApplication.count({
      where: { status: 'pending' },
    });

    return {
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
    };
  }
}
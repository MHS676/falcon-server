import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // Job endpoints
  @Post()
  async createJob(@Body() createJobDto: CreateJobDto) {
    // Parse string arrays if they come as strings
    const processedDto = { ...createJobDto };
    
    if (typeof processedDto.requirements === 'string') {
      processedDto.requirements = processedDto.requirements.split(',').map(s => s.trim()).filter(s => s);
    }
    if (typeof processedDto.benefits === 'string') {
      processedDto.benefits = processedDto.benefits.split(',').map(s => s.trim()).filter(s => s);
    }
    if (typeof processedDto.skills === 'string') {
      processedDto.skills = processedDto.skills.split(',').map(s => s.trim()).filter(s => s);
    }

    return this.jobsService.createJob(processedDto as CreateJobDto);
  }

  @Get()
  async getAllJobs() {
    return this.jobsService.getAllJobs();
  }

  @Get('active')
  async getActiveJobs() {
    return this.jobsService.getActiveJobs();
  }

  @Get('stats')
  async getJobStats() {
    return this.jobsService.getJobStats();
  }

  @Get(':id')
  async getJobById(@Param('id') id: string) {
    return this.jobsService.getJobById(id);
  }

  @Patch(':id')
  async updateJob(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    // Parse string arrays if they come as strings
    const processedDto = { ...updateJobDto };
    
    if (typeof processedDto.requirements === 'string') {
      processedDto.requirements = processedDto.requirements.split(',').map(s => s.trim()).filter(s => s);
    }
    if (typeof processedDto.benefits === 'string') {
      processedDto.benefits = processedDto.benefits.split(',').map(s => s.trim()).filter(s => s);
    }
    if (typeof processedDto.skills === 'string') {
      processedDto.skills = processedDto.skills.split(',').map(s => s.trim()).filter(s => s);
    }

    return this.jobsService.updateJob(id, processedDto as UpdateJobDto);
  }

  @Delete(':id')
  async deleteJob(@Param('id') id: string) {
    return this.jobsService.deleteJob(id);
  }

  // Job Application endpoints
  @Post('apply')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './uploads/resumes',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, `resume-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(pdf|doc|docx)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only PDF, DOC, and DOCX files are allowed for resumes'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async applyForJob(
    @Body() createJobApplicationDto: CreateJobApplicationDto,
    @UploadedFile() resumeFile: Express.Multer.File,
  ) {
    if (!resumeFile) {
      throw new BadRequestException('Resume file is required');
    }

    return this.jobsService.createJobApplication(
      createJobApplicationDto,
      `/uploads/resumes/${resumeFile.filename}`,
    );
  }

  @Post('apply-with-portfolio')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/portfolios',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const isResume = file.fieldname === 'resume';
          const prefix = isResume ? 'resume' : 'portfolio';
          cb(null, `${prefix}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const isResume = file.fieldname === 'resume';
        if (isResume) {
          if (file.mimetype.match(/\/(pdf|doc|docx)$/)) {
            cb(null, true);
          } else {
            cb(new BadRequestException('Only PDF, DOC, and DOCX files are allowed for resumes'), false);
          }
        } else {
          if (file.mimetype.match(/\/(pdf|doc|docx|jpg|jpeg|png|gif|zip|rar)$/)) {
            cb(null, true);
          } else {
            cb(new BadRequestException('Invalid file type for portfolio'), false);
          }
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit per file
      },
    }),
  )
  async applyForJobWithPortfolio(
    @Body() createJobApplicationDto: CreateJobApplicationDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const resumeFile = files.find(f => f.fieldname === 'resume');
    const portfolioFiles = files.filter(f => f.fieldname !== 'resume');

    if (!resumeFile) {
      throw new BadRequestException('Resume file is required');
    }

    const portfolioPaths = portfolioFiles.map(f => `/uploads/portfolios/${f.filename}`);

    return this.jobsService.createJobApplication(
      createJobApplicationDto,
      `/uploads/resumes/${resumeFile.filename}`,
      portfolioPaths,
    );
  }

  @Get('applications/all')
  async getAllJobApplications() {
    return this.jobsService.getAllJobApplications();
  }

  @Get('applications/job/:jobId')
  async getJobApplicationsByJob(@Param('jobId') jobId: string) {
    return this.jobsService.getJobApplicationsByJob(jobId);
  }

  @Get('applications/:id')
  async getJobApplicationById(@Param('id') id: string) {
    return this.jobsService.getJobApplicationById(id);
  }

  @Patch('applications/:id')
  async updateJobApplication(
    @Param('id') id: string,
    @Body() updateJobApplicationDto: UpdateJobApplicationDto,
  ) {
    return this.jobsService.updateJobApplication(id, updateJobApplicationDto);
  }

  @Delete('applications/:id')
  async deleteJobApplication(@Param('id') id: string) {
    return this.jobsService.deleteJobApplication(id);
  }
}
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CareerService } from './career.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('career')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  // Public routes for career listings
  @Get('active')
  findActive() {
    return this.careerService.findActive();
  }

  @Get('featured')
  findFeatured() {
    return this.careerService.findFeatured();
  }

  @Get('public/:id')
  findOnePublic(@Param('id', ParseUUIDPipe) id: string) {
    return this.careerService.findOne(id);
  }

  // Public route for job applications
  @Post('apply')
  createApplication(@Body() createApplicationDto: CreateApplicationDto) {
    return this.careerService.createApplication(createApplicationDto);
  }

  // Admin protected routes (now public)
  @Post()
  create(@Body() createCareerDto: CreateCareerDto) {
    return this.careerService.create(createCareerDto);
  }

  @Get()
  findAll(@Query('includeInactive') includeInactive?: string) {
    return this.careerService.findAll(includeInactive === 'true');
  }

  @Get('stats')
  getStats() {
    return this.careerService.getCareerStats();
  }

  @Get('applications')
  findAllApplications(@Query('careerId') careerId?: string) {
    return this.careerService.findAllApplications(careerId);
  }

  @Get('applications/:id')
  findApplication(@Param('id', ParseUUIDPipe) id: string) {
    return this.careerService.findApplicationById(id);
  }

  @Patch('applications/:id/status')
  updateApplicationStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: string,
  ) {
    return this.careerService.updateApplicationStatus(id, status);
  }

  @Delete('applications/:id')
  deleteApplication(@Param('id', ParseUUIDPipe) id: string) {
    return this.careerService.deleteApplication(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.careerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCareerDto: UpdateCareerDto,
  ) {
    return this.careerService.update(id, updateCareerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.careerService.remove(id);
  }
}
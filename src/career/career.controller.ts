import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CareerService } from './career.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

  // Admin protected routes
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCareerDto: CreateCareerDto) {
    return this.careerService.create(createCareerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('includeInactive') includeInactive?: string) {
    return this.careerService.findAll(includeInactive === 'true');
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats() {
    return this.careerService.getCareerStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('applications')
  findAllApplications(@Query('careerId') careerId?: string) {
    return this.careerService.findAllApplications(careerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('applications/:id')
  findApplication(@Param('id', ParseUUIDPipe) id: string) {
    return this.careerService.findApplicationById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('applications/:id/status')
  updateApplicationStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: string,
  ) {
    return this.careerService.updateApplicationStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('applications/:id')
  deleteApplication(@Param('id', ParseUUIDPipe) id: string) {
    return this.careerService.deleteApplication(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.careerService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCareerDto: UpdateCareerDto,
  ) {
    return this.careerService.update(id, updateCareerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.careerService.remove(id);
  }
}
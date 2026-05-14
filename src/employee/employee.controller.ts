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
  Query,
} from '@nestjs/common';
import { FilesInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UploadService } from '../upload/upload.service';

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      for (const file of files) {
        const url = await this.uploadService.uploadImage(file, 'employees');
        if (file.fieldname === 'resume') createEmployeeDto.resume = url;
        else if (file.fieldname === 'idCard') createEmployeeDto.idCard = url;
        else createEmployeeDto.photo = url; // photo or any other field
      }
    }
    if (typeof createEmployeeDto.certifications === 'string') {
      try { createEmployeeDto.certifications = JSON.parse(createEmployeeDto.certifications as any); } catch { createEmployeeDto.certifications = []; }
    }
    if (typeof createEmployeeDto.skills === 'string') {
      try { createEmployeeDto.skills = JSON.parse(createEmployeeDto.skills as any); } catch { createEmployeeDto.skills = []; }
    }
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get('active')
  findActive() {
    return this.employeeService.findActive();
  }

  @Get('stats')
  getStats() {
    return this.employeeService.getStats();
  }

  @Get('department/:department')
  findByDepartment(@Param('department') department: string) {
    return this.employeeService.findByDepartment(department);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.employeeService.findByStatus(status);
  }

  @Get('search')
  findByEmployeeId(@Query('employeeId') employeeId: string) {
    return this.employeeService.findByEmployeeId(employeeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      for (const file of files) {
        const url = await this.uploadService.uploadImage(file, 'employees');
        if (file.fieldname === 'resume') updateEmployeeDto.resume = url;
        else if (file.fieldname === 'idCard') updateEmployeeDto.idCard = url;
        else updateEmployeeDto.photo = url; // photo or any other field
      }
    }
    if (typeof updateEmployeeDto.active === 'string') {
      updateEmployeeDto.active = (updateEmployeeDto.active as any) === 'true';
    }
    if (typeof updateEmployeeDto.certifications === 'string') {
      try { updateEmployeeDto.certifications = JSON.parse(updateEmployeeDto.certifications as any); } catch { updateEmployeeDto.certifications = []; }
    }
    if (typeof updateEmployeeDto.skills === 'string') {
      try { updateEmployeeDto.skills = JSON.parse(updateEmployeeDto.skills as any); } catch { updateEmployeeDto.skills = []; }
    }
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}

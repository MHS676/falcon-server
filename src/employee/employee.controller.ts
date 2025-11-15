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
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/employees',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      // Handle file uploads
      files.forEach((file) => {
        const fieldName = file.fieldname;
        if (fieldName === 'photo') {
          createEmployeeDto.photo = `/uploads/employees/${file.filename}`;
        } else if (fieldName === 'resume') {
          createEmployeeDto.resume = `/uploads/employees/${file.filename}`;
        } else if (fieldName === 'idCard') {
          createEmployeeDto.idCard = `/uploads/employees/${file.filename}`;
        }
      });
    }

    // Parse array fields if they come as strings
    if (typeof createEmployeeDto.certifications === 'string') {
      createEmployeeDto.certifications = JSON.parse(createEmployeeDto.certifications as any);
    }
    if (typeof createEmployeeDto.skills === 'string') {
      createEmployeeDto.skills = JSON.parse(createEmployeeDto.skills as any);
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
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/employees',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      files.forEach((file) => {
        const fieldName = file.fieldname;
        if (fieldName === 'photo') {
          updateEmployeeDto.photo = `/uploads/employees/${file.filename}`;
        } else if (fieldName === 'resume') {
          updateEmployeeDto.resume = `/uploads/employees/${file.filename}`;
        } else if (fieldName === 'idCard') {
          updateEmployeeDto.idCard = `/uploads/employees/${file.filename}`;
        }
      });
    }

    // Parse array fields if they come as strings
    if (typeof updateEmployeeDto.certifications === 'string') {
      updateEmployeeDto.certifications = JSON.parse(updateEmployeeDto.certifications as any);
    }
    if (typeof updateEmployeeDto.skills === 'string') {
      updateEmployeeDto.skills = JSON.parse(updateEmployeeDto.skills as any);
    }

    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}

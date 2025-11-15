import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    // Check if employee ID already exists
    const existingById = await this.prisma.employee.findUnique({
      where: { employeeId: createEmployeeDto.employeeId },
    });

    if (existingById) {
      throw new ConflictException('Employee ID already exists');
    }

    // Check if email already exists
    const existingByEmail = await this.prisma.employee.findUnique({
      where: { email: createEmployeeDto.email },
    });

    if (existingByEmail) {
      throw new ConflictException('Email already exists');
    }

    return this.prisma.employee.create({
      data: {
        ...createEmployeeDto,
        dateOfBirth: createEmployeeDto.dateOfBirth ? new Date(createEmployeeDto.dateOfBirth) : null,
        joinDate: new Date(createEmployeeDto.joinDate),
      },
    });
  }

  async findAll() {
    return this.prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    return this.prisma.employee.findMany({
      where: { 
        active: true,
        status: 'active'
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByDepartment(department: string) {
    return this.prisma.employee.findMany({
      where: { department },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(status: string) {
    return this.prisma.employee.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async findByEmployeeId(employeeId: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    // Check if employee exists
    await this.findOne(id);

    // If updating employee ID, check for duplicates
    if (updateEmployeeDto.employeeId) {
      const existing = await this.prisma.employee.findUnique({
        where: { employeeId: updateEmployeeDto.employeeId },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Employee ID already exists');
      }
    }

    // If updating email, check for duplicates
    if (updateEmployeeDto.email) {
      const existing = await this.prisma.employee.findUnique({
        where: { email: updateEmployeeDto.email },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    return this.prisma.employee.update({
      where: { id },
      data: {
        ...updateEmployeeDto,
        dateOfBirth: updateEmployeeDto.dateOfBirth ? new Date(updateEmployeeDto.dateOfBirth) : undefined,
        joinDate: updateEmployeeDto.joinDate ? new Date(updateEmployeeDto.joinDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.employee.delete({
      where: { id },
    });
  }

  async getStats() {
    const [total, active, onLeave, terminated, byDepartment] = await Promise.all([
      this.prisma.employee.count(),
      this.prisma.employee.count({ where: { status: 'active' } }),
      this.prisma.employee.count({ where: { status: 'on-leave' } }),
      this.prisma.employee.count({ where: { status: 'terminated' } }),
      this.prisma.employee.groupBy({
        by: ['department'],
        _count: true,
      }),
    ]);

    return {
      total,
      active,
      onLeave,
      terminated,
      byDepartment: byDepartment.map(d => ({
        department: d.department || 'Unassigned',
        count: d._count,
      })),
    };
  }
}

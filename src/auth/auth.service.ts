import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const admin = await this.prisma.admin.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
      },
    });

    const { password, ...result } = admin;
    return result;
  }

  async login(loginDto: LoginDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: loginDto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: admin.email, sub: admin.id, role: admin.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  async validateAdmin(email: string, password: string): Promise<any> {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (admin && await bcrypt.compare(password, admin.password)) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  // Admin Management Methods
  async getAllAdmins() {
    const admins = await this.prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return admins;
  }

  async getAdminById(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async createAdmin(createAdminDto: CreateAdminDto, creatorId: string) {
    // Check if creator is superadmin
    const creator = await this.prisma.admin.findUnique({
      where: { id: creatorId },
    });

    if (creator?.role !== 'superadmin') {
      throw new ForbiddenException('Only superadmin can create new admins');
    }

    // Check if email already exists
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: createAdminDto.email },
    });

    if (existingAdmin) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = await this.prisma.admin.create({
      data: {
        email: createAdminDto.email,
        password: hashedPassword,
        name: createAdminDto.name,
        role: createAdminDto.role || 'admin',
        isActive: createAdminDto.isActive ?? true,
      },
    });

    const { password, ...result } = admin;
    return result;
  }

  async updateAdmin(id: string, updateAdminDto: UpdateAdminDto, updaterId: string) {
    const updater = await this.prisma.admin.findUnique({
      where: { id: updaterId },
    });

    const targetAdmin = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!targetAdmin) {
      throw new NotFoundException('Admin not found');
    }

    // Only superadmin can update other admins or change roles
    if (updaterId !== id && updater?.role !== 'superadmin') {
      throw new ForbiddenException('You can only update your own account');
    }

    if (updateAdminDto.role && updater?.role !== 'superadmin') {
      throw new ForbiddenException('Only superadmin can change roles');
    }

    // Prevent last superadmin from demoting themselves
    if (targetAdmin.role === 'superadmin' && updateAdminDto.role === 'admin') {
      const superadminCount = await this.prisma.admin.count({
        where: { role: 'superadmin', isActive: true },
      });

      if (superadminCount <= 1) {
        throw new BadRequestException('Cannot demote the last superadmin');
      }
    }

    const admin = await this.prisma.admin.update({
      where: { id },
      data: updateAdminDto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return admin;
  }

  async deleteAdmin(id: string, deleterId: string) {
    const deleter = await this.prisma.admin.findUnique({
      where: { id: deleterId },
    });

    if (deleter?.role !== 'superadmin') {
      throw new ForbiddenException('Only superadmin can delete admins');
    }

    const targetAdmin = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!targetAdmin) {
      throw new NotFoundException('Admin not found');
    }

    // Prevent deleting yourself
    if (id === deleterId) {
      throw new BadRequestException('Cannot delete your own account');
    }

    // Prevent deleting last superadmin
    if (targetAdmin.role === 'superadmin') {
      const superadminCount = await this.prisma.admin.count({
        where: { role: 'superadmin', isActive: true },
      });

      if (superadminCount <= 1) {
        throw new BadRequestException('Cannot delete the last superadmin');
      }
    }

    await this.prisma.admin.delete({
      where: { id },
    });

    return { message: 'Admin deleted successfully' };
  }

  async changePassword(adminId: string, changePasswordDto: ChangePasswordDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await this.prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: forgotPasswordDto.email },
    });

    if (!admin) {
      // Don't reveal if email exists or not
      return { message: 'If the email exists, a reset link will be sent' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // TODO: Send email with reset token
    // For now, return the token (in production, this should be sent via email)
    return { 
      message: 'Password reset token generated',
      resetToken, // Remove this in production
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const admin = await this.prisma.admin.findFirst({
      where: {
        resetToken: resetPasswordDto.token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!admin) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password reset successfully' };
  }
}

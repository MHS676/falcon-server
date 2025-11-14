import { Controller, Post, Body, HttpCode, HttpStatus, Get, Patch, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Admin Management Endpoints
  @Get('admins')
  @UseGuards(JwtAuthGuard)
  async getAllAdmins() {
    return this.authService.getAllAdmins();
  }

  @Get('admins/:id')
  @UseGuards(JwtAuthGuard)
  async getAdminById(@Param('id') id: string) {
    return this.authService.getAdminById(id);
  }

  @Post('admins')
  @UseGuards(JwtAuthGuard)
  async createAdmin(@Body() createAdminDto: CreateAdminDto, @Request() req) {
    return this.authService.createAdmin(createAdminDto, req.user.sub);
  }

  @Patch('admins/:id')
  @UseGuards(JwtAuthGuard)
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Request() req
  ) {
    return this.authService.updateAdmin(id, updateAdminDto, req.user.sub);
  }

  @Delete('admins/:id')
  @UseGuards(JwtAuthGuard)
  async deleteAdmin(@Param('id') id: string, @Request() req) {
    return this.authService.deleteAdmin(id, req.user.sub);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req) {
    return this.authService.changePassword(req.user.sub, changePasswordDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.authService.getAdminById(req.user.sub);
  }
}

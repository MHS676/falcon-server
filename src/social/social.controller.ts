import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SocialService } from './social.service';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSocialLinkDto: CreateSocialLinkDto) {
    return this.socialService.create(createSocialLinkDto);
  }

  @Get()
  findAll() {
    return this.socialService.findAll();
  }

  @Get('active')
  findActive() {
    return this.socialService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socialService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSocialLinkDto: UpdateSocialLinkDto) {
    return this.socialService.update(id, updateSocialLinkDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialService.remove(id);
  }
}

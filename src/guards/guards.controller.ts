import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GuardsService } from './guards.service';
import { CreateGuardDto } from './dto/create-guard.dto';
import { UpdateGuardDto } from './dto/update-guard.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('guards')
export class GuardsController {
  constructor(private readonly guardsService: GuardsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createGuardDto: CreateGuardDto) {
    return this.guardsService.create(createGuardDto);
  }

  @Get()
  findAll() {
    return this.guardsService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.guardsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guardsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateGuardDto: UpdateGuardDto) {
    return this.guardsService.update(id, updateGuardDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.guardsService.remove(id);
  }
}
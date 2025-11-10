import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { ContactModule } from './contact/contact.module';
import { ExperienceModule } from './experience/experience.module';
import { BlogModule } from './blog/blog.module';
import { SettingsModule } from './settings/settings.module';
import { BannerModule } from './banner/banner.module';
import { SocialModule } from './social/social.module';
import { CareerModule } from './career/career.module';
import { UploadModule } from './upload/upload.module';
import { GuardsModule } from './guards/guards.module';
import { ServicesModule } from './services/services.module';
import { ClientsModule } from './clients/clients.module';
import { GalleryModule } from './gallery/gallery.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    ContactModule,
    ExperienceModule,
    BlogModule,
    SettingsModule,
    BannerModule,
    SocialModule,
    GuardsModule,
    ServicesModule,
    ClientsModule,
    GalleryModule,
    CareerModule,
    UploadModule,
    JobsModule,
  ],
})
export class AppModule {}

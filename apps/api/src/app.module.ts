import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { validateEnvironment } from './config/environment';
import { LinksModule } from './links/links.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: ['.env', '../../.env'],
      isGlobal: true,
      validate: validateEnvironment,
    }),
    PrismaModule,
    LinksModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'
import { Env } from './env'
import { join } from 'node:path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  
  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('PORT', { infer: true })

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  await app.listen(port)
}
bootstrap();

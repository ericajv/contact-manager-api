import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service';
import { CreateAccountController } from './controllers/create-account.controller'
import { envSchema } from 'src/env'
import { AuthModule } from './auth/auth.module';
import { AuthenticateController } from './controllers/authenticate-controller';
import { CreateContactController } from './controllers/create-contact.controller';
import { FetchContactController } from './controllers/fetch-contact.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateAccountController, 
    AuthenticateController, 
    CreateContactController,
    FetchContactController,
  ],
  providers: [PrismaService],
})
export class AppModule {}

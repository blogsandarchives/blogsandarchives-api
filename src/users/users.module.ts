import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DefaultConfigService } from '~/default-config.service';
import { SessionsModule } from '~/sessions/sessions.module';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
    forwardRef(() => SessionsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, DefaultConfigService],
  exports: [UsersService],
})
export class UsersModule {}

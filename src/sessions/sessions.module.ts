import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DefaultConfigService } from '~/default-config.service';
import { UsersModule } from '~/users/users.module';
import { Session, SessionSchema } from './schemas/session.schema';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    forwardRef(() => UsersModule),
    ConfigModule,
  ],
  controllers: [SessionsController],
  providers: [SessionsService, DefaultConfigService],
  exports: [SessionsService],
})
export class SessionsModule {}

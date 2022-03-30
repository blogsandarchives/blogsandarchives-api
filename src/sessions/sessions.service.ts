import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { LoginUserDto } from '~/users/dto/login-user.dto';
import { Session, SessionDocument } from './schemas/session.schema';
import { UsersService } from '~/users/users.service';
import { nowSeconds, secondsToDate } from '~/time.helper';
import { DefaultConfigService } from '~/default-config.service';
import { TerminateSessionDto } from './dto/terminate-session.dto';
import { SessionNotFoundError } from './errors/session-not-found.error';
import { AuthFailedError } from '~/users/errors/auth-failed.error';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private usersService: UsersService,
    private defaultConfigService: DefaultConfigService,
  ) {}

  async create(loginUserDto: LoginUserDto): Promise<SessionDocument> {
    const userDoc = await this.usersService.findOneByUsername(
      loginUserDto.username,
    );

    if (
      !userDoc ||
      !(await argon2.verify(userDoc.passwordHash, loginUserDto.password))
    )
      throw new AuthFailedError('Incorrect credentials.');

    const exp = this.defaultConfigService.sessionExpDuration;

    return new this.sessionModel({
      sessionId: crypto.randomBytes(32).toString('base64url'),
      user: userDoc,
      expirationDate: secondsToDate(nowSeconds() + exp),
    }).save();
  }

  async findOneBySessionId(sessionId: string) {
    return this.sessionModel.findOne({ sessionId: sessionId }).exec();
  }

  async remove(
    terminateSessionDto: TerminateSessionDto,
  ): Promise<SessionDocument> {
    const sessionDoc = await this.findOneBySessionId(
      terminateSessionDto.sessionId,
    );

    if (!sessionDoc) throw new SessionNotFoundError('Session does not exists.');

    await sessionDoc.populate('user');

    if (
      !(await argon2.verify(
        sessionDoc.user.passwordHash,
        terminateSessionDto.password,
      ))
    )
      throw new AuthFailedError('Incorrect credentials.');

    return sessionDoc.remove();
  }
}

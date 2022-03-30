import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { LoginUserDto } from '~/users/dto/login-user.dto';
import { Session, SessionDocument } from './schemas/session.schema';
import { UsersService } from '~/users/users.service';
import { NewSessionError } from './errors/new-session.error';
import { nowSeconds, secondsToDate } from '~/time.helper';
import { DefaultConfigService } from '~/default-config.service';

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
      throw new NewSessionError('Incorrect credentials.');

    const exp = this.defaultConfigService.sessionExpDuration;

    return new this.sessionModel({
      sessionId: crypto.randomBytes(32).toString('base64url'),
      user: userDoc,
      expirationDate: secondsToDate(nowSeconds() + exp),
    }).save();
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nowSeconds, secondsToDate } from '~/helpers/time.helper';
import { User, UserDocument } from '~/users/schemas/user.schema';
import { Session, SessionDocument } from './schemas/session.schema';

@Injectable()
export class SessionsService {
  defaultSessExp: number;

  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
    private readonly configService: ConfigService,
  ) {
    this.defaultSessExp =
      parseInt(this.configService.get('SESSION_EXP')) || 604800;
  }

  async create(user: UserDocument, exp: number = this.defaultSessExp) {
    return new this.sessionModel({
      user: user,
      expirationDate: secondsToDate(nowSeconds() + exp),
    }).save();
  }

  async findOne(id: string): Promise<SessionDocument> {
    return this.sessionModel.findOne({ id: id }).exec();
  }

  async findAll(user: User): Promise<SessionDocument[]> {
    return this.sessionModel.find({ user: user }).exec();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { nowDate } from '~/time.helper';
import { RegisterUserDto } from './dto/register-user.dto';
import { CreateUserError } from './errors/create-user.error';
import { User, UserDocument } from './schemas/user.schema';
import { DefaultConfigService } from '~/default-config.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private defaultConfigService: DefaultConfigService,
  ) {}

  async create(registerUserDto: RegisterUserDto): Promise<UserDocument> {
    if (
      await this.userModel.exists({ username: registerUserDto.username }).exec()
    )
      throw new CreateUserError('Username is already taken.');

    const hash = await argon2.hash(registerUserDto.password, {
      hashLength: this.defaultConfigService.argon2TagLen,
      timeCost: this.defaultConfigService.argon2Iter,
      memoryCost: this.defaultConfigService.argon2Mem,
      parallelism: this.defaultConfigService.argon2P,
      type: this.defaultConfigService.argon2Type,
      saltLength: this.defaultConfigService.argon2SaltLen,
    });

    return new this.userModel({
      fullname: registerUserDto.fullname,
      username: registerUserDto.username,
      passwordHash: hash,
      creationDate: nowDate(),
    }).save();
  }

  async findOneByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username: username }).exec();
  }
}

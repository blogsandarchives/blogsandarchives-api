import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserError } from './errors/create-user.error';
import { User, UserDocument } from './schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    if (
      await this.userModel.exists({ username: createUserDto.username }).exec()
    )
      throw new CreateUserError('Username is already taken.');

    const passwordHash = await argon2.hash(createUserDto.password, {
      type: argon2.argon2id,
      timeCost: parseInt(this.configService.get('ARGON2_ITER')) || 3,
      parallelism: parseInt(this.configService.get('ARGON2_P')) || 4,
      memoryCost: parseInt(this.configService.get('ARGON2_MEM')) || 65535,
      saltLength: parseInt(this.configService.get('ARGON2_SALT_LEN')) || 16,
      hashLength: parseInt(this.configService.get('ARGON2_TAG_LEN')) || 32,
    });

    return new this.userModel({
      fullname: createUserDto.fullname,
      username: createUserDto.username,
      passwordHash: passwordHash,
      creationDate: new Date(Date.now()),
    }).save();
  }

  async findOne(filter: FilterQuery<UserDocument>): Promise<UserDocument> {
    return this.userModel.findOne(filter).exec();
  }
}

import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { genRes } from '~/helpers/response.helper';
import { dateToSeconds } from '~/helpers/time.helper';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('info/:username')
  async getInfo(@Param('username') username: string) {
    const userDoc = await this.usersService.findOne({ username: username });

    if (!userDoc)
      return genRes(false, HttpStatus.NO_CONTENT, {
        msg: 'User not found.',
      });

    return genRes(true, HttpStatus.OK, {
      id: userDoc.id,
      fullname: userDoc.fullname,
      username: userDoc.username,
      registerTimestamp: dateToSeconds(userDoc.creationDate),
    });
  }

  @Get('find/:fullname')
  async find(@Param('fullname') fullname: string) {
    const userDocs = await this.usersService.findAll({ fullname: fullname });

    if (userDocs.length === 0)
      return genRes(false, HttpStatus.NO_CONTENT, {
        msg: 'No users are found.',
      });

    const users = [];
    for (const userDoc of userDocs) {
      users.push({
        id: userDoc.id,
        fullname: userDoc.fullname,
        username: userDoc.username,
        registerTimestamp: dateToSeconds(userDoc.creationDate),
      });
    }

    return genRes(true, HttpStatus.OK, {
      users: users,
    });
  }

  @Post('register')
  async register(@Body() createUserDto: RegisterUserDto) {
    try {
      const userDoc = await this.usersService.create(createUserDto);

      return genRes(true, HttpStatus.CREATED, {
        id: userDoc.id,
        fullname: userDoc.fullname,
        username: userDoc.username,
        creationTimestamp: dateToSeconds(userDoc.creationDate),
      });
    } catch (error) {
      return genRes(false, HttpStatus.BAD_REQUEST, {
        msg: error.message,
      });
    }
  }
}

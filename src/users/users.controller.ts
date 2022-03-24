import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { genRes } from '~/helpers/response.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('info/:username')
  async getInfo(@Param('username') username: string) {
    const userDoc = await this.usersService.findOne({ username: username });

    return genRes(true, HttpStatus.OK, {
      id: userDoc.id,
      fullname: userDoc.fullname,
      username: userDoc.username,
      registerTimestamp: userDoc.creationDate.valueOf(),
    });
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const userDoc = await this.usersService.create(createUserDto);

    return genRes(true, HttpStatus.CREATED, {
      id: userDoc.id,
      fullname: userDoc.fullname,
      username: userDoc.username,
      creationTimestamp: userDoc.creationDate.valueOf(),
    });
  }
}

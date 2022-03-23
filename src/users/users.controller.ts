import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { genRes } from '~/helpers/response.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return genRes(true, HttpStatus.CREATED, {
      fullname: user.fullname,
      username: user.username,
      creationTimestamp: user.creationDate.valueOf(),
    });
  }
}

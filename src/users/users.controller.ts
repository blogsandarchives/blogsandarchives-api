import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { genRes } from '~/response.helper';
import { dateToSeconds } from '~/time.helper';
import { RegisterUserDto } from './dto/register-user.dto';
import { CreateUserError } from './errors/create-user.error';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    try {
      const userDoc = await this.usersService.create(registerUserDto);

      return genRes(true, HttpStatus.CREATED, {
        fullname: userDoc.fullname,
        username: userDoc.username,
        creationTimestamp: dateToSeconds(userDoc.creationDate),
      });
    } catch (err) {
      if (!(err instanceof CreateUserError)) throw err;

      return genRes(false, HttpStatus.BAD_REQUEST, {
        msg: err.message,
      });
    }
  }
}

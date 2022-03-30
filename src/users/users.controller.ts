import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { genRes } from '~/response.helper';
import { NewSessionError } from '~/sessions/errors/new-session.error';
import { SessionsService } from '~/sessions/sessions.service';
import { dateToSeconds } from '~/time.helper';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { CreateUserError } from './errors/create-user.error';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private sessionsService: SessionsService,
  ) {}

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

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const sessionDoc = await this.sessionsService.create(loginUserDto);

      return genRes(true, HttpStatus.OK, {
        sessionId: sessionDoc.sessionId,
      });
    } catch (err) {
      if (!(err instanceof NewSessionError)) throw err;

      return genRes(false, HttpStatus.UNAUTHORIZED, {
        msg: err.message,
      });
    }
  }
}

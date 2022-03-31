import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { genRes } from '~/response.helper';
import { SessionsService } from '~/sessions/sessions.service';
import { dateToSeconds } from '~/time.helper';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthFailedError } from './errors/auth-failed.error';
import { UsernameUnavailableError } from './errors/username-unavailable.error';
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
      if (!(err instanceof UsernameUnavailableError)) throw err;

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
      if (!(err instanceof AuthFailedError)) throw err;

      return genRes(false, HttpStatus.UNAUTHORIZED, {
        msg: err.message,
      });
    }
  }

  @Get('info')
  async info(@Query('username') username: string) {
    if (!username)
      return genRes(false, HttpStatus.BAD_REQUEST, {
        msg: `Missing query string ("username").`,
      });

    const userDoc = await this.usersService.findOneByUsername(username);

    if (!userDoc)
      return genRes(false, HttpStatus.NO_CONTENT, {
        msg: 'User does not exists.',
      });

    return genRes(true, HttpStatus.OK, {
      fullname: userDoc.fullname,
      registerTimestamp: dateToSeconds(userDoc.creationDate),
    });
  }
}

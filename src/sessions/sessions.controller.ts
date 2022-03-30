import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { genRes } from '~/response.helper';
import { AuthFailedError } from '~/users/errors/auth-failed.error';
import { TerminateSessionDto } from './dto/terminate-session.dto';
import { SessionNotFoundError } from './errors/session-not-found.error';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Post('terminate')
  async terminate(@Body() terminateSessionDto: TerminateSessionDto) {
    try {
      const sessionDoc = await this.sessionsService.remove(terminateSessionDto);

      return genRes(true, HttpStatus.OK, {
        sessionId: sessionDoc.sessionId,
      });
    } catch (err) {
      let status: number;
      switch (err.constructor) {
        case SessionNotFoundError:
          status = HttpStatus.BAD_REQUEST;
          break;
        case AuthFailedError:
          status = HttpStatus.UNAUTHORIZED;
          break;
        default:
          throw err;
      }

      return genRes(false, status, {
        msg: err.message,
      });
    }
  }
}

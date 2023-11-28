import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  auth,
  InvalidTokenError,
  UnauthorizedError,
} from 'express-oauth2-jwt-bearer';
import { promisify } from 'util';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    console.log(request);

    const validateAccessToken = promisify(auth());

    try {
      await validateAccessToken(request, response);

      return true;
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        console.warn('1 InvalidTokenError');

        throw new UnauthorizedException('Bad credentials');
      }

      if (error instanceof UnauthorizedError) {
        console.warn('2 UnauthorizedError');
        throw new UnauthorizedException('Requires authentication');
      }

      console.warn('3 InternalServerErrorException');

      throw new InternalServerErrorException();
    }
  }
}

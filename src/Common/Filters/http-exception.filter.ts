import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ExceptionHelper } from './Helpers/exception.helper';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private exceptionHelper: ExceptionHelper = new ExceptionHelper();

  catch(exception: unknown, host: ArgumentsHost): void {
    this.exceptionHelper.exceptionResponse(exception, host);
  }
}

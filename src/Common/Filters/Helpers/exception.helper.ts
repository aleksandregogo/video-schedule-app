import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

export class ExceptionHelper {
  public exceptionResponse(exception: any, host: ArgumentsHost) {
    let error = exception.error ? exception.getError() : exception.response;
    if (!error) error = this.getExceptionMessageAndStatus(exception);

    const dataCollector = {
      traceId: host.switchToWs().getData().traceId,
      context: ExceptionHelper.name,
      exception: exception,
    };
    console.error({
      message:
        typeof exception.getError === 'object'
          ? exception.getError.message
          : exception.getError,
      extra: dataCollector,
    });
  }

  public getExceptionMessageAndStatus(exception: any) {
    let message, statusCode;
    switch (true) {
      case exception instanceof HttpException:
        const exceptInstance = exception as HttpException;
        message = exceptInstance.message;
        statusCode = exceptInstance.getStatus();
        break;
      default:
        exception.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = exception.toString();
        break;
    }
    return { message, statusCode };
  }
}

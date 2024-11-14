import {ArgumentsHost, BadRequestException, HttpException, HttpStatus, UnauthorizedException} from "@nestjs/common";
import {EntityMetadataNotFoundError, EntityNotFoundError, QueryFailedError} from 'typeorm';
import {WsException} from "@nestjs/websockets";

export class ExceptionHelper {
  public exceptionResponse(exception: any, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest()
    const response = host.switchToHttp().getResponse();

    const {statusCode, errorCode, subErrorCode, message, data} =
        this.getExceptionMessageAndStatus(exception);

    const responseBody = {
        statusCode: statusCode,
        errorCode: errorCode,
        subErrorCode: subErrorCode,
        message,
        data,
        timestamp: new Date().toISOString(),
        path: request.url,
        traceId: request.body.traceId
    };

    let dataCollector = {
        traceId: request.body.traceId,
        path: request.path,
        method: request.method,
        requestType: 'http',
        userIP: request.ip,
        userId: request.body.userId,
        context: ExceptionHelper.name,
        message: exception.stack.toString(),
        request: {body: request.body, query: request.query, params: request.params, header: request.headers},
        exception: exception,
        statusCode: statusCode,
    }

    console.error({
        message: `[${response.statusCode}] - [${request.method}] - ${request.path}`,
        extra: dataCollector
    });

    host.switchToHttp()
      .getResponse()
      .status(statusCode || HttpStatus.BAD_REQUEST)
      .send(responseBody);
  }

    public getExceptionMessageAndStatus(exception: any) {
        let message, statusCode, data, errorCode, subErrorCode;
        switch (true) {
            case exception instanceof UnauthorizedException:
                const unauthorized: UnauthorizedException = exception;
                message = unauthorized.message;
                statusCode = HttpStatus.UNAUTHORIZED
                break;
            case exception instanceof QueryFailedError:
                const queryFailedError: QueryFailedError = exception;
                message = queryFailedError.message;
                statusCode = HttpStatus.BAD_REQUEST
                break;
            case exception instanceof EntityNotFoundError:
                const entityNotFoundError: EntityNotFoundError = exception;
                message = entityNotFoundError.message.split('matching')[0];
                statusCode = HttpStatus.NOT_FOUND
                break;
            case exception instanceof EntityMetadataNotFoundError:
                const entityMetadataNotFoundError: EntityMetadataNotFoundError = exception;
                message = entityMetadataNotFoundError.message;
                statusCode = statusCode = HttpStatus.BAD_REQUEST
                break;
            case exception instanceof BadRequestException:
                const badRequestError = exception as BadRequestException;
                const response = badRequestError.getResponse();
                const typeOf = typeof response;
                if (typeOf === 'object') {
                    const rs = badRequestError.getResponse() as unknown as any;
                    message = rs.message;
                } else {
                    message = response;
                }
                statusCode = badRequestError.getStatus();
                break;
            case exception instanceof WsException:
                const wsException = exception as WsException;
                message = wsException.getError();
                statusCode = HttpStatus.BAD_REQUEST;
                break;
            case exception instanceof HttpException:
                const exceptInstance = exception as HttpException;
                statusCode = exceptInstance.getStatus();
                const errorData = exceptInstance.getResponse() as any;
                if (typeof errorData === 'object') {
                    message = errorData.message;
                    errorCode = errorData.errorCode;
                    subErrorCode = errorData.subErrorCode;
                    data = errorData.exceptionData;
                } else {
                    message = exceptInstance.message;
                }
                break;
            default:
                exception.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                message = exception.toString();
                break;
        }
        return {message, errorCode, subErrorCode, statusCode, data};
    }
}

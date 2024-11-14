import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ServerResponse} from "http";

@Injectable()
export class HTTPLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let req = context.switchToHttp().getRequest()

    // Logs when an http Request is caught after the middleware
    console.log({
      message: `[${req.method}] - ${req.path}`,
      extra: {
        path: req.path,
        method: req.method,
        headers: req.headers,
        requestType: 'http',
        userIP: req.ip,
        context: HTTPLoggingInterceptor.name,
        request: {body: req.body, query: req.query, params: req.params},
        direction: 'Request',
      }
    })

    return next.handle().pipe(tap((tapResponseData: Response) => {
      const httpResponse:ServerResponse = context.switchToHttp().getResponse();
      // Logs when an http Response is caught after a controller
      console.log({
        message: `[${httpResponse.statusCode}] - [${req.method}] - ${req.path}`,
        extra: {
          statusCode: httpResponse.statusCode,
          requestType: 'http',
          userIp: req.ip,
          context: this.constructor.name,
          response: tapResponseData,
          direction: "Response"
        }
      })
    }))
  }
}

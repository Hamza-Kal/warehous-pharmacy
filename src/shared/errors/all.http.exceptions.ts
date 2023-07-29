import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm/error/QueryFailedError';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger();

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      // eslint-disable-next-line prefer-const
      let httpException = exception as HttpException;
      const status = httpException.getStatus();
      const { error } = httpException.getResponse() as { error: object };
      console.log(httpException);
      const res = {
        isCustom: true,
        statusCode: status,
        error: httpException.getResponse(),
        timestamp: new Date().toISOString(),
        path: request.url,
      };
      console.log({ ...res, message: httpException.getResponse() });
      response.status(status).json(res);
    } else if (exception instanceof QueryFailedError) {
      const typeormException = exception as QueryFailedError;
      if (typeormException.driverError.sqlState == 23000) {
        console.log(typeormException.driverError.sqlMessage);
        response.status(HttpStatus.BAD_REQUEST).json({
          isCustom: false,
          statusCode: 400,
          error: {
            message: typeormException.driverError.sqlMessage,
            code: 23000,
          },
          timestamps: Date.now(),
          path: request.url,
        });
      } else {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          isCustom: false,
          statusCode: 500,
          error: { message: typeormException },
          timestamps: Date.now(),
          path: request.url,
        });
      }
    } else {
      this.logger.error(exception);
      const { message } = exception as { message: string };
      response.status(500).json({
        isCustom: false,
        statusCode: 500,
        error: {
          code: 500004,
          message,
        },
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}

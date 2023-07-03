import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch(Error)
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse();
    if (exception.constructor === HttpException) {
      const httpException = exception as HttpException;
      const error = httpException.getResponse();
      const status = httpException.getStatus();
      response.status(status).json({
        error,
        timestamps: Date.now(),
        path: request.url,
      });
    } else if (exception.constructor === QueryFailedError) {
      const typeormException = exception as QueryFailedError;
      if (typeormException.driverError.sqlState == 23000) {
        response.status(HttpStatus.BAD_REQUEST).json({
          error: {
            message: typeormException.driverError.sqlMessage,
            code: 23000,
          },
        });
      } else {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'something wrong happened',
          error: { message: typeormException },
        });
      }
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'unknown something happened',
        error: {
          message: exception.message,
        },
      });
    }
  }
}

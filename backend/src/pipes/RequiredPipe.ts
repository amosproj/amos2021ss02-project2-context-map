import { HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

/**
 * Makes sure that a parameter is given.
 * Interprets an empty string as not given.
 */
@Injectable()
export class RequiredPipe implements PipeTransform {
  // eslint-disable-next-line class-methods-use-this
  transform<T>(value: T | undefined): T {
    if (value == null || (typeof value === 'string' && value.trim().length === 0)) {
      throw new HttpErrorByCode[HttpStatus.BAD_REQUEST](
        `Required argument missing`
      );
    }

    return value;
  }
}

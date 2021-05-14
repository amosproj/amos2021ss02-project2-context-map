import { HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class RequiredPipe implements PipeTransform {
  // eslint-disable-next-line class-methods-use-this
  transform<T>(value: T | undefined): T {
    if (value == null || (typeof value === 'string' && value.length === 0)) {
      throw new HttpErrorByCode[HttpStatus.BAD_REQUEST](
        `Required argument missing`
      );
    }

    return value;
  }
}

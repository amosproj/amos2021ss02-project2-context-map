import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  Optional,
  ParseIntPipe,
  PipeTransform,
} from '@nestjs/common';
import {
  ErrorHttpStatusCode,
  HttpErrorByCode,
} from '@nestjs/common/utils/http-error-by-code.util';

export interface ParseIntPipeOptions {
  errorHttpStatusCode?: ErrorHttpStatusCode;
  exceptionFactory?: (error: string) => any;
}

/**
 * Transforms an input to an int-array.
 * Uses {@link ParseIntPipe} to transform the array values to int.
 * Also works with non-ints as input
 */
@Injectable()
export class ParseIntArrayPipe implements PipeTransform {
  protected exceptionFactory: (error: string) => any;

  private readonly parseIntPipe: ParseIntPipe;

  constructor(@Optional() options?: ParseIntPipeOptions) {
    options = options || {};
    const {
      exceptionFactory,
      errorHttpStatusCode = HttpStatus.BAD_REQUEST,
    } = options;

    this.exceptionFactory =
      exceptionFactory ||
      ((error) => new HttpErrorByCode[errorHttpStatusCode](error));

    this.parseIntPipe = new ParseIntPipe(options);
  }

  async transform(
    value: unknown,
    metadata: ArgumentMetadata,
  ): Promise<number[]> {
    if (typeof value === 'number' || typeof value === 'string') {
      value = [value];
    }

    if (Array.isArray(value)) {
      return Promise.all(
        value.map((v) => this.parseIntPipe.transform(v, metadata)),
      );
    }

    throw this.exceptionFactory(
      'Validation failed (list of numeric strings expected)',
    );
  }
}

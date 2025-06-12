import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

type ClassConstructor<T extends object> = {
  new (): T;
};

@Injectable()
export class ParseAndValidateJsonPipe<T extends object>
  implements PipeTransform
{
  constructor(private readonly dtoClass: ClassConstructor<T>) {}

  async transform(value: string): Promise<T> {
    try {
      const parsed: unknown = JSON.parse(value);
      const instance = plainToInstance(this.dtoClass, parsed);

      await validateOrReject(instance);
      return instance;
    } catch {
      throw new BadRequestException('Validation failed');
    }
  }
}

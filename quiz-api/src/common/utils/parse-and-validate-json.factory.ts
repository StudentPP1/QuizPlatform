import { Type } from '@nestjs/common';

import { ParseAndValidateJsonPipe } from '@common/pipes/parse-and-validate-json.pipe';

export function createValidationPipe<T extends object>(dtoClass: Type<T>) {
  return new ParseAndValidateJsonPipe(dtoClass);
}

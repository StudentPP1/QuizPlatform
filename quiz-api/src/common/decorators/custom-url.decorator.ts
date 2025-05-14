import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsCustomUrl(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCustomUrl',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return (
            typeof value === 'string' &&
            (value.startsWith('http://') ||
              value.startsWith('https://') ||
              value.startsWith('blob:'))
          );
        },
        defaultMessage() {
          return 'The URL must start with http://, https://, or blob:';
        },
      },
    });
  };
}

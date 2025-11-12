import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonArrayPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') {
      try {
        // Try to parse as JSON
        const parsed = JSON.parse(value);
        // Only accept arrays
        if (Array.isArray(parsed)) {
          return parsed;
        }
        // If it's a single value, wrap in array
        return [parsed];
      } catch (e) {
        // If JSON parsing fails, return as string
        return value;
      }
    }
    return value;
  }
}

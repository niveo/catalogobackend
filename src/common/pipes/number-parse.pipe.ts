import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class NumberParsePipe implements PipeTransform<number, number> {
  transform(value: number, metadata: ArgumentMetadata) {
    console.log(value);
    
    if (value > 10) {
      return value;
    }

    throw new BadRequestException('Value must be greater ten.');
  }
}

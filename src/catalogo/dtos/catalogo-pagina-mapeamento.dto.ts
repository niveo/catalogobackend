import { ApiProperty } from '@nestjs/swagger';

export class CatalogoPaginaMapeamentoDto {
  @ApiProperty({
    type: Number,
    readOnly: true,
  })
  id?: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  inicialPosicalX: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  finalPosicalX: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  inicialPosicalY: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  finalPosicalY: number;

  width: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  height: number;
}

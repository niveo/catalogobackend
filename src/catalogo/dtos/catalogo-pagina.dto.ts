import { ApiProperty } from '@nestjs/swagger';

export class CatalogoPaginaDto {
  @ApiProperty({
    type: Number,
    readOnly: true,
  })
  id?: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  pagina: number;
}

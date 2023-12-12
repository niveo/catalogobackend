import { PartialType } from '@nestjs/swagger';
import { ProdutoDto } from './produto.dto';

export class UpdateProdutoDto extends PartialType(ProdutoDto) {}

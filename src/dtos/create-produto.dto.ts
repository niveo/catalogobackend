import { PartialType } from '@nestjs/swagger';
import { ProdutoDto } from './produto.dto';

export class CreateProdutoDto extends PartialType(ProdutoDto) {}

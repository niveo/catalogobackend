import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { Produto } from 'src/entities/produto.entity';
import { Repository } from 'typeorm';
import { CreateProdutoDto } from './dtos/create-produto.dto';
import { ProdutoDto } from './dtos/produto.dto';
import { UpdateProdutoDto } from './dtos/update-produto.dto';
import { parse } from 'csv-parse/sync';
@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,

    private readonly cls: ClsService,
  ) {}

  async getAll(): Promise<ProdutoDto[]> {
    const userId = this.cls.get('userId');
    return await this.produtoRepository.find({
      where: {
        userId: userId,
      },
    });
  }

  create(createProdutoDto: CreateProdutoDto): Promise<ProdutoDto> {
    const userId = this.cls.get('userId');
    createProdutoDto.userId = userId;
    return this.produtoRepository.save(createProdutoDto);
  }

  async getId(id: number): Promise<ProdutoDto> {
    const userId = this.cls.get('userId');
    return this.produtoRepository.findOneByOrFail({
      id: id,
      userId: userId,
    });
  }

  async deleteId(id: number): Promise<number> {
    const userId = this.cls.get('userId');
    return (
      await this.produtoRepository.softDelete({
        id: id,
        userId: userId,
      })
    ).affected;
  }

  async update(
    id: number,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<number> {
    return (await this.produtoRepository.update(id, updateProdutoDto)).affected;
  }

  async importarProdutos(
    files: Express.Multer.File[],
    comCabecalho: boolean,
    separador = ';',
  ) {
    const userId = this.cls.get('userId');
    const registros: any[] = await parse(files[0].buffer);
    const mapeados = registros
      .map((e: any[], i: number) => {
        if (!(comCabecalho && i === 0)) {
          const reg = e[0].split(separador);
          if (!reg[1]) return null;
          return {
            referencia: reg[0],
            descricao: reg[1],
            ativo: reg[2] === '1',
            userId: userId,
          };
        }
      })
      .filter((f) => f);
    await this.produtoRepository
      .createQueryBuilder()
      .insert()
      .into(Produto)
      .values(mapeados)
      .orIgnore()
      .execute();
  }
}
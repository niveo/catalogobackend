import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parse } from 'csv-parse/sync';
import { ClsService } from 'nestjs-cls';
import { Repository } from 'typeorm';
import { CreateProdutoDto, ProdutoDto, UpdateProdutoDto } from '../dtos';
import { Produto } from '../entities/produto.entity';
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
        ativo: true,
      },
    });
  }

  create(createProdutoDto: CreateProdutoDto): Promise<ProdutoDto> {
    const userId = this.cls.get('userId');
    createProdutoDto.userId = userId;
    return this.produtoRepository.save(createProdutoDto);
  }

  createMany(createProdutoDto: CreateProdutoDto[]): Promise<ProdutoDto[]> {
    return this.produtoRepository.save(createProdutoDto);
  }

  //Usuado para remover todos os dados do sistema para um novo importe
  async removerSistema() {
    const userId = this.cls.get('userId');
    return await this.produtoRepository.delete({
      sistema: true,
      userId: userId,
    });
  }

  async getId(id: number): Promise<ProdutoDto> {
    const userId = this.cls.get('userId');
    return this.produtoRepository.findOneByOrFail({
      id: id,
      userId: userId,
    });
  }

  getReferencia(referencia: string): Promise<ProdutoDto> {
    const userId = this.cls.get('userId');
    return this.getReferenciaUsuario(referencia, userId);
  }

  getReferenciaUsuario(
    referencia: string,
    userId: string,
  ): Promise<ProdutoDto> {
    return this.produtoRepository.findOneByOrFail({
      referencia: referencia,
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
    files: Buffer,
    comCabecalho: boolean,
    separador = ';',
  ) {
    const userId = this.cls.get('userId');
    const registros: any[] = await parse(files);
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
    return (
      await this.produtoRepository
        .createQueryBuilder()
        .insert()
        .into(Produto)
        .values(mapeados)
        .orIgnore()
        .execute()
    ).identifiers;
  }
}

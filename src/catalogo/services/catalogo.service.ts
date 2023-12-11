import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogoDto, CreateCatalogoDto, UpdateCatalogoDto } from '../dtos';
import { Catalogo } from '../entities/catalogo.entity';
import ImageKit from 'imagekit';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class CatalogoService {
  constructor(
    @InjectRepository(Catalogo)
    private catalogoRepository: Repository<Catalogo>,

    @Inject(ImageKit.name)
    private readonly imageKit: ImageKit,
    private readonly cls: ClsService,
  ) {}

  async getAll(): Promise<CatalogoDto[]> {
    const userId = this.cls.get('userId');
    return await this.catalogoRepository.find({
      where: {
        userId: userId,
      },
    });
  }

  create(catalogoCreateDto: CreateCatalogoDto): Promise<CatalogoDto> {
    const userId = this.cls.get('userId');
    catalogoCreateDto.userId = userId;
    return this.catalogoRepository.save(catalogoCreateDto);
  }

  async getId(id: number): Promise<CatalogoDto> {
    const userId = this.cls.get('userId');
    return this.catalogoRepository.findOneByOrFail({
      id: id,
      userId: userId,
    });
  }

  async deleteId(id: number): Promise<number> {
    const userId = this.cls.get('userId');
    return (
      await this.catalogoRepository.softDelete({
        id: id,
        userId: userId,
      })
    ).affected;
  }

  async update(
    id: number,
    updateCatalogoDto: UpdateCatalogoDto,
  ): Promise<number> {
    return (await this.catalogoRepository.update(id, updateCatalogoDto))
      .affected;
  }

  catalogoLazy(id: number): Promise<CatalogoDto> {
    const userId = this.cls.get('userId');
    const qb = this.catalogoRepository.createQueryBuilder('catalogo');
    qb.leftJoinAndSelect('catalogo.paginas', 'paginas');
    qb.where('catalogo.id = :id', { id: id });
    qb.andWhere('catalogo.userId = :userId', { userId: userId });
    return qb.getOneOrFail();
  }

  async importarCatalogo(
    descricao: string,
    ativo: boolean,
    files: Express.Multer.File[],
  ) {
    const userId = this.cls.get('userId');

    const catalogo = await this.catalogoRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const catalogoEntity = new Catalogo();
        catalogoEntity.descricao = descricao;
        catalogoEntity.ativo = ativo;
        catalogoEntity.paginas = [];
        catalogoEntity.userId = userId;

        let index = 0;
        for (const file of files) {
          const ret = await this.imageKit.upload({
            folder: `catalogo/${catalogoEntity.identificador}`,
            fileName: String(index),
            file: files[index].buffer,
          });
          catalogoEntity.paginas.push({
            pagina: index,
            size: ret.size,
            height: ret.height,
            width: ret.width,
            name: ret.name,
          });
          index++;
        }

        return await transactionalEntityManager.save<Catalogo>(catalogoEntity);
      },
    );

    return catalogo.id;
  }
}

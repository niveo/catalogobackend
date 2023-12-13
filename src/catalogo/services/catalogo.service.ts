import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ImageKit from 'imagekit';
import { ClsService } from 'nestjs-cls';
import { Observable, defer, from, map } from 'rxjs';
import { CatalogoDto, CreateCatalogoDto, UpdateCatalogoDto } from 'src/dtos';
import { Repository } from 'typeorm';
import { Catalogo } from '../../entities/catalogo.entity';

@Injectable()
export class CatalogoService {
  constructor(
    @InjectRepository(Catalogo)
    private catalogoRepository: Repository<Catalogo>,

    @Inject(ImageKit.name)
    private readonly imageKit: ImageKit,
    private readonly cls: ClsService,
  ) {}

  getAll(): Observable<CatalogoDto[]> {
    const userId = this.cls.get('userId');
    return defer(() =>
      from(
        this.catalogoRepository.find({
          where: {
            userId: userId,
            ativo: true,
          },
        }),
      ),
    );
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

  deleteId(id: number): Observable<number> {
    const userId = this.cls.get('userId');
    return defer(() =>
      from(
        this.catalogoRepository.softDelete({
          id: id,
          userId: userId,
        }),
      ),
    ).pipe(map(({ affected }) => affected));
  }

  async update(
    id: number,
    updateCatalogoDto: UpdateCatalogoDto,
  ): Promise<number> {
    return (await this.catalogoRepository.update(id, updateCatalogoDto))
      .affected;
  }

  getCatalogoLazy(id: number): Promise<CatalogoDto> {
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

        let index = 1;
        for (const file of files) {
          const ret = await this.imageKit.upload({
            folder: `catalogo/${catalogoEntity.identificador}`,
            fileName: String(index),
            file: files[index - 1].buffer,
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

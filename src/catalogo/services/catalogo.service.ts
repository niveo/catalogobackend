import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogoDto, CreateCatalogoDto, UpdateCatalogoDto } from '../dtos';
import { Catalogo } from '../entities/catalogo.entity';
import ImageKit from 'imagekit';

@Injectable()
export class CatalogoService {
  constructor(
    @InjectRepository(Catalogo)
    private catalogoRepository: Repository<Catalogo>,

    @Inject(ImageKit.name)
    private readonly imageKit: ImageKit,
  ) {}

  async getAll(): Promise<CatalogoDto[]> {
    return await this.catalogoRepository.find();
  }

  create(catalogoCreateDto: CreateCatalogoDto): Promise<CatalogoDto> {
    return this.catalogoRepository.save(catalogoCreateDto);
  }

  async getId(id: number): Promise<CatalogoDto> {
    return this.catalogoRepository.findOneByOrFail({
      id: id,
    });
  }

  async deleteId(id: number): Promise<number> {
    return (
      await this.catalogoRepository.softDelete({
        id: id,
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

  async importarCatalogo(
    descricao: string,
    ativo: boolean,
    file: Array<Express.Multer.File>,
  ) {
    await this.catalogoRepository.manager.transaction(
      async (transactionalEntityManager) => {
        let catalogoEntity = new Catalogo();
        catalogoEntity.descricao = descricao;
        catalogoEntity.ativo = ativo;

        catalogoEntity =
          await transactionalEntityManager.save<Catalogo>(catalogoEntity);
      },
    );

    /*await this.imageKit.upload({
      folder: `catalogo/${catalogoEntity.id}`,
      fileName: file.fieldname,
      file: file.buffer,
    });*/
  }
}

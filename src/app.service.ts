import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v5 as uuidv5, v4 } from 'uuid';
import catalogoData from '../data/catalogo.json';
import produtoData from '../data/produtos.json';
import { CatalogoService } from './catalogo/services/catalogo.service';
import { ProdutoService } from './produto/produto.service';
import ImageKit from 'imagekit';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly catalogoService: CatalogoService,
    private readonly produtoService: ProdutoService,
    @Inject(ImageKit.name)
    private readonly imageKit: ImageKit,
  ) {}

  async registeredUser(user_id: string) {
    const id = uuidv5(user_id, this.configService.get('AUDIENCE'));

    try {
      produtoData.forEach((f) => (f['userId'] = id));
      await this.produtoService.createMany(produtoData);
    } catch (e) {
      console.error(e);
    }
    try {
      for (const catalogo of catalogoData) {
        catalogo['identificador'] = v4();
        for (const pagina of catalogo.paginas) {
          await this.imageKit.copyFolder({
            sourceFolderPath: 'catalogo/padrao/*',
            destinationPath:
              'catalogo/catalogos/' + catalogo['identificador'] + '/',
          });
          for (const mapeamento of pagina.mapeamentos) {
            for (let produto of mapeamento.produtos) {
              produto = Object.assign(
                produto,
                await this.produtoService.getReferenciaUsuario(
                  produto.referencia,
                  id,
                ),
              );
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    const idCreate = (
      await this.catalogoService.createCatalogoUser(catalogoData[0] as any, id)
    ).id;
    console.log('Catalogo padrão importado ' + idCreate);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';
import { v5 as uuidv5, v4 } from 'uuid';
import catalogoData from '../data/catalogo.json';
import produtoData from '../data/produtos.json';
import { CatalogoService } from './catalogo/services/catalogo.service';
import { ProdutoService } from './produto/produto.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly catalogoService: CatalogoService,
    private readonly produtoService: ProdutoService,
    @Inject(ImageKit.name)
    private readonly imageKit: ImageKit,
    private readonly cls: ClsService,
    private readonly config: ConfigService,
  ) {}

  getUserProfile(): any {
    return {
      userId: this.cls.get('userId'),
      teste: this.config.get<boolean>('ENV_TESTE'),
      vercel: this.config.get<boolean>('ENV_VERCEL'),
      host: this.config.get('PGHOST'),
      username: this.config.get('PGUSER'),
      url: this.config
        .get('DATABASE_URL')
        .replace(
          this.config.get('PGPASSWORD'),
          'X'.padEnd(this.config.get('PGPASSWORD').length, 'X'),
        ),
      database: this.config.get('PGDATABASE'),
      VERCEL_ENV: this.config.get('VERCEL_ENV'),
      VERCEL_BRANCH_URL: this.config.get('VERCEL_BRANCH_URL'),
      VERCEL_GIT_PROVIDER: this.config.get('VERCEL_GIT_PROVIDER'),
      VERCEL_GIT_REPO_ID: this.config.get('VERCEL_GIT_REPO_ID'),
      VERCEL_GIT_COMMIT_REF: this.config.get('VERCEL_GIT_COMMIT_REF'),
      VERCEL_GIT_COMMIT_SHA: this.config.get('VERCEL_GIT_COMMIT_SHA'),
      VERCEL_GIT_COMMIT_MESSAGE: this.config.get('VERCEL_GIT_COMMIT_MESSAGE'),
      VERCEL_GIT_COMMIT_AUTHOR_LOGIN: this.config.get(
        'VERCEL_GIT_COMMIT_AUTHOR_LOGIN',
      ),
      VERCEL_GIT_COMMIT_AUTHOR_NAME: this.config.get(
        'VERCEL_GIT_COMMIT_AUTHOR_NAME',
      ),
      VERCEL_GIT_PREVIOUS_SHA: this.config.get('VERCEL_GIT_PREVIOUS_SHA'),
      VERCEL_GIT_PULL_REQUEST_ID: this.config.get('VERCEL_GIT_PULL_REQUEST_ID'),
    };
  }

  async registeredUser(user_id: string) {
    const id = uuidv5(user_id, this.configService.get('AUDIENCE'));

    console.log(
      'Carregando dados basicos para o usuario: ' + user_id + ' / ' + id,
    );

    await this.catalogoService.removerSistema();
    await this.produtoService.removerSistema();

    produtoData.forEach((f) => (f['userId'] = id));
    await this.produtoService.createMany(produtoData);

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
    const idCreate = (
      await this.catalogoService.createCatalogoUser(catalogoData[0] as any, id)
    ).id;
    console.log('Catalogo padrão importado ' + idCreate);
    return idCreate;
  }
}

import { Injectable } from '@nestjs/common';
import { create, Archiver } from 'archiver';
import fs from 'fs';
import { Database } from 'sqlite3';
import { CatalogoPaginaMapeamentoService } from 'src/catalogo/services/catalogo-pagina-mapeamento.service';
import { v4 } from 'uuid';
import { CatalogoService } from '../catalogo/services/catalogo.service';
import { ProdutoService } from '../produto/produto.service';
import { CatalogoPaginaService } from './../catalogo/services/catalogo-pagina.service';

interface FileDirName {
  fileDirZip: string;
  fileNameZip: string;
}
@Injectable()
export class MobileService {
  constructor(
    private readonly produtoService: ProdutoService,
    private readonly catalogoservice: CatalogoService,
    private readonly catalogoPaginaService: CatalogoPaginaService,
    private readonly catalogoPaginaMapeamentoService: CatalogoPaginaMapeamentoService,
  ) {}

  async carregarArquivoBuffer() {
    let db: Database;
    let file: FileDirName;
    try {
      console.log('INICIANDO BANCO');
      db = await this.conectar();

      await this.inserirRegistros(
        db,
        'CREATE TABLE produto (id INTEGER, descricao TEXT, referencia TEXT, ativo Boolean)',
        'INSERT INTO produto VALUES (?,?,?,?)',
        await this.produtoService.getAll(),
        ['id', 'descricao', 'referencia', 'ativo'],
      );

      await this.inserirRegistros(
        db,
        'CREATE TABLE catalogo (id INTEGER, descricao TEXT, titulo TEXT, logo TEXT, avatar TEXT, ativo Boolean)',
        'INSERT INTO catalogo VALUES (?,?,?,?,?,?)',
        await this.catalogoservice.getAll(),
        ['id', 'descricao', 'titulo', 'logo', 'avatar', 'ativo'],
      );

      await this.inserirRegistros(
        db,
        'CREATE TABLE catalogo_pagina (id INTEGER, pagina INTEGER, size INTEGER, height INTEGER, width INTEGER, name TEXT, catalogoId INTEGER)',
        'INSERT INTO catalogo_pagina VALUES (?,?,?,?,?,?,?)',
        await this.catalogoPaginaService.getCatalogoPaginaMobile(),
        ['id', 'pagina', 'size', 'height', 'width', 'name', 'catalogoId'],
      );

      await this.inserirRegistros(
        db,
        'CREATE TABLE catalogo_pagina_mapeamento (id INTEGER, inicialPosicalX INTEGER, finalPosicalX INTEGER, inicialPosicalY INTEGER, finalPosicalY INTEGER, width INTEGER, height INTEGER, catalogoPaginaId INTEGER)',
        'INSERT INTO catalogo_pagina_mapeamento VALUES (?,?,?,?,?,?,?,?)',
        await this.catalogoPaginaMapeamentoService.getCatalogoPaginaMapeamentoMobile(),
        [
          'id',
          'inicialPosicalX',
          'finalPosicalX',
          'inicialPosicalY',
          'finalPosicalY',
          'width',
          'height',
          'catalogoPaginaId',
        ],
      );

      await this.inserirRegistros(
        db,
        'CREATE TABLE catalogo_pagina_mapeamento_produtos_produto (catalogoPaginaMapeamentoId INTEGER, produtoId INTEGER)',
        'INSERT INTO catalogo_pagina_mapeamento_produtos_produto VALUES (?,?)',
        await this.catalogoPaginaMapeamentoService.getCatalogoPaginaMapeamentoProdutos(),
        ['catalogoPaginaMapeamentoId', 'produtoId'],
      );

      file = await this.criarArquivosTemporario(db);

      return {
        file: fs.readFileSync(file.fileDirZip),
        fileName: file.fileNameZip,
      };
    } catch (e) {
      console.error('Erro');
      console.error(e);
      throw e;
    } finally {
      console.log('FECHANDO BANCO');
      db?.close();
      console.log('FECHANDO ZIP');
      this.removerArquivoTemporario(file?.fileDirZip);
    }
  }

  private async criarArquivosTemporario(db: Database): Promise<FileDirName> {
    const identFile = v4().replaceAll('-', '');
    const fileName = `${identFile}.db`;
    const fileDirName = `/tmp/${fileName}`;
    const fileNameZip = `${identFile}.zip`;
    const fileDirZip = `/tmp/${fileNameZip}`;
    let archive: Archiver;

    return new Promise(async (rs, rj) => {
      try {
        await this.criarBancoTemporario(db, fileDirName);
        console.log('File %s criado', fileDirName);

        const output = fs.createWriteStream(fileDirZip);
        archive = create('zip', { zlib: { level: 9 } });

        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', () => {
          console.log(archive.pointer() + ' total bytes');
          console.log(
            'archiver has been finalized and the output file descriptor has closed.',
          );
          rs({ fileDirZip: fileDirZip, fileNameZip: fileNameZip });
        });

        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        output.on('end', () => {
          console.log('Data has been drained');
        });

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on('warning', (err) => {
          if (err.code === 'ENOENT') {
            console.warn(err.code);
          } else {
            // throw error
            throw err;
          }
        });

        // good practice to catch this error explicitly
        archive.on('error', (err) => {
          throw err;
        });

        archive.pipe(output);
        archive.append(fs.createReadStream(fileDirName), { name: fileName });

        console.log('File %s criado', fileDirZip);
      } catch (e) {
        rj(e);
        throw e;
      } finally {
        archive?.finalize();
        this.removerArquivoTemporario(fileDirName);
      }
    });
  }

  private async criarBancoTemporario(
    db: Database,
    fileDirName: string,
  ): Promise<void> {
    return await new Promise((rs, rj) => {
      db.exec(`vacuum main into '${fileDirName}'`, (error: Error) => {
        if (error) {
          rj(error);
        } else rs();
      });
    });
  }

  private inserirRegistros(
    db: Database,
    create: string,
    prepare: string,
    registros: any[],
    keys: string[],
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        try {
          db.run(create, (error) => {
            if (error) throw error;
          });
          const stmt = db.prepare(prepare, (error) => {
            if (error) throw error;
          });

          console.info('Registros: ' + registros.length);
          registros.forEach((registro) => {
            const valores = keys.map((key) => registro[key]);
            stmt.run(valores, (error) => {
              if (error) throw error;
            });
          });

          stmt.finalize((error) => {
            if (error) throw error;
          });

          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  private async conectar(): Promise<Database> {
    return new Promise<Database>((resolve, reject) => {
      const db = new Database(':memory:', (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(db);
        }
      });
    });
  }

  removerArquivoTemporario(fileName) {
    console.log('Removendo arquivo %s', fileName);

    fs.access(fileName, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      fs.rm(fileName, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    });
  }
}

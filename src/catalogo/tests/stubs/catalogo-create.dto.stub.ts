import { CatalogoDto, ProdutoDto } from '../../../dtos';

export const CatalogoCreateDtoStub = (): CatalogoDto => {
  return {
    descricao: 'Catalogo 1',
    ativo: true,
    paginas: [
      {
        pagina: 1,
        mapeamentos: [
          {
            inicialPosicalX: 247.924,
            finalPosicalX: 472.446,
            inicialPosicalY: 358.189,
            finalPosicalY: 784.281,
            width: 224.521,
            height: 426.091,
            produtos: [new ProdutoDto()],
          },
          {
            inicialPosicalX: 567.244,
            finalPosicalX: 779.79,
            inicialPosicalY: 373.157,
            finalPosicalY: 783.283,
            width: 212.547,
            height: 410.126,
            produtos: [new ProdutoDto()],
          },
        ],
      },
      {
        pagina: 2,
        mapeamentos: [
          {
            inicialPosicalX: 876.584,
            finalPosicalX: 1135.03,
            inicialPosicalY: 374.155,
            finalPosicalY: 783.283,
            width: 258.449,
            height: 409.128,
            produtos: [new ProdutoDto()],
          },
          {
            inicialPosicalX: 250.918,
            finalPosicalX: 480.429,
            inicialPosicalY: 819.206,
            finalPosicalY: 1223.34,
            width: 229.511,
            height: 404.138,
            produtos: [new ProdutoDto()],
          },
        ],
      },
      {
        pagina: 4,
        mapeamentos: [
          {
            inicialPosicalX: 878.58,
            finalPosicalX: 1117.07,
            inicialPosicalY: 807.232,
            finalPosicalY: 1222.35,
            width: 238.491,
            height: 415.115,
            produtos: [new ProdutoDto()],
          },
          {
            inicialPosicalX: 242.935,
            finalPosicalX: 473.444,
            inicialPosicalY: 1250.29,
            finalPosicalY: 1675.38,
            width: 230.509,
            height: 425.094,
            produtos: [new ProdutoDto()],
          },
        ],
      },
    ],
  };
};

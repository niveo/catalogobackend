import { CatalogoPaginaMapeamentoDto, ProdutoDto } from 'src/dtos';

export const CatalogoPaginaMapeamentoUpdateDtoStub =
  (): CatalogoPaginaMapeamentoDto => {
    return {
      inicialPosicalX: 100.924,
      finalPosicalX: 472.446,
      inicialPosicalY: 358.189,
      finalPosicalY: 784.281,
      width: 224.521,
      height: 426.091,
      produtos: [new ProdutoDto()],
    };
  };

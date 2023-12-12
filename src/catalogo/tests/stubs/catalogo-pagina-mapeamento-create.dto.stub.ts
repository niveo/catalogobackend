import { CatalogoPaginaMapeamentoDto, ProdutoDto } from 'src/dtos';

export const CatalogoPaginaMapeamentoCreateDtoStub = (
  catalogoPagina: any,
): CatalogoPaginaMapeamentoDto => {
  return {
    catalogoPagina: catalogoPagina,
    inicialPosicalX: 247.924,
    finalPosicalX: 472.446,
    inicialPosicalY: 358.189,
    finalPosicalY: 784.281,
    width: 224.521,
    height: 426.091,
    produto: new ProdutoDto(),
  };
};

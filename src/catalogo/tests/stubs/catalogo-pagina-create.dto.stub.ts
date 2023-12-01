import { CatalogoPaginaDto } from '../../dtos';

export const CatalogoPaginaCreateDtoStub = (
  catalogo: any,
): CatalogoPaginaDto => {
  return {
    pagina: 1,
    catalogo: catalogo,
    mapeamentos: [
      {
        inicialPosicalX: 247.924,
        finalPosicalX: 472.446,
        inicialPosicalY: 358.189,
        finalPosicalY: 784.281,
        width: 224.521,
        height: 426.091,
      },
      {
        inicialPosicalX: 567.244,
        finalPosicalX: 779.79,
        inicialPosicalY: 373.157,
        finalPosicalY: 783.283,
        width: 212.547,
        height: 410.126,
      },
    ],
  };
};

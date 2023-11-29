import { CreateCatalogoPaginaDto } from '../../dtos';
import { CreateUpdateIdCatalogoPaginaDtoStub } from './create-update-catalogo-pagina.dto.stub';
export const CreateCatalogoPaginaDtoStub = (): CreateCatalogoPaginaDto => {
  return {
    pagina: 1,
    catalogoID: CreateUpdateIdCatalogoPaginaDtoStub(),
  };
};

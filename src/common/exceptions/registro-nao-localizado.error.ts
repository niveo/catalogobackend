export class RegistroNaoLocalizadoError extends Error {
  constructor() {
    super();
    this.message = 'Registro não localizado.';
  }
}

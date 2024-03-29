# Sistema de Estudo Portfolio Catalogo de Produtos

Esse sistema tem o intuito de mapear os produtos em um catalogo com suas cordenadas X e Y levando esses dados para um aplicativo android onde o cliente pode clicar no catalogo e detalhar o produto ou mesmo lançar ele em um pedido.

## Notas
Esse é um sistema composto em 3 partes
* [BackEnd](https://github.com/niveo/catalogobackend) NestJS
* [FrontEnd](https://github.com/niveo/froncatalogo) Angular
* [Aplicativo](https://github.com/niveo/appcatalogo) Android


## FrontEnd
https://catalogofrontend.vercel.app

### APIs
https://catalogobackend.vercel.app/api/catalogo   
https://catalogobackend.vercel.app/api/produto

Tecnologias Utilizadas
- JavaScript Runtime - https://nodejs.org/en
- FrameWork - https://nestjs.com
- Banco de Dados - https://neon.tech * PostgreSQL  
- Backend Cloud - https://vercel.com
- Repositório de Imagens - https://imagekit.io
- Segurança Autorização - https://auth0.com

#### Variaveis de Ambiente
Crie o arquivo .env no diretorio raiz e inclua todas as **env** com seus respectivos valores   
**env**   
PORT=7000   
##### DOCKER
>POSTGRES_PASSWORD=""  
POSTGRES_USER=""  
POSTGRES_DB=""  

##### AUTH0
> ISSUER_BASE_URL=""  
AUDIENCE=""  
CLIENT_ORIGIN_URL=""  
CLIENTE_ID=""  
CLIENT_SECRET=""  

##### IMAGEKIT
> IMAGEKIT_PUBLIC_KEY=""  
IMAGEKIT_PRIVATE_KEY=""  
IMAGEKIT_URLENDPOINT=""  

##### VERCEL e NEON
> PGPASSWORD=""  
PGUSER=""  
PGDATABASE=""  
PGHOST=""  
DATABASE_URL=""  

**Para testar ou rodar o aplicativo localmente**
- Clone o repositorio
- Informe os valores na .env acima
- Instale as dependências com o comando `yarn` no terminal
- Onde esta localizado o arquivo "docker-compose.yml" escreva o comando:
`docker compose up -d` no terminal, isso ira iniciar um container com o banco postgre local.
- Para iniciar a aplicação escreva o comando `yarn start:dev` no terminal
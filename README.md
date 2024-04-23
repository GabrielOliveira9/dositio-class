# API DOSITIO
Primeira expansão da API "Dositio" desenvolvida durante as aulas do professor Wagner Perin de Programação Avançada para Web. Utilizada como atividade avaliativa para o primeiro bimestre.
## Adições
### Novas rotas e funcionalidades:
* **GET `/categories`:** Retorna a lista de categorias de produtos existentes.
* **POST `/categories`:** Cria uma nova categoria no banco de dados.
* **PUT `/categories/:id`:** Atualiza os dados de uma categoria específica.
* **DELETE `/categories/:id`:** Remove uma categoria específica.
* **GET `/categories/:id/products`:** Retorna a lista de produtos de uma determinada categoria.
* **POST`/register`:** Registra um novo usuário.
### Validação e testagem
Foram implementadas novas funcionalidades de validação e testagem. Nas pastas correspondentes de cada rota dentro da pasta _/hooks/functions_ e no arquivo _test_, respectivamente.
## Instalação
Após abrir a pasta na IDE, digite a seguintes linha no terminal ara instalar todas as bibliotecas, frameworks e plugins:
```
npm install
```
## Configuração
O arquivo _.env.sample_ deve ser renomeado para _.env_ e suas propriedades devem ser alteradas para que estejam de acordo com as que você irá usar.
## Inicialização
O comando a seguir deve ser digitado no terminal para inicializar o ambiente:
```
npm run dev
```
## Testagem
### Criação dos registros
Para executar os testes, devem ser criadas no banco de dados as entradas representadas nos arquivos `dositio.categories.json` e `dositio.products.json`.
### Execução dos testes
Para executar a sequência de testes, o comando a seguir deve ser digitado no terminal:
```
npm run test
```
### Repetição da testagem
Para realizar uma nova testagem, deve garantir-se de que os registros estão novamente iguais ao seu respectivo arquivo JSON. 

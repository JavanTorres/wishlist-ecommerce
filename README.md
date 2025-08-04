# wishlist-ecommerce
Wishlist e-commerce

O Husky pode apresentar problemas de funcionamento em repositórios monorepo (dois projetos em um único git), pois espera a estrutura padrão do Git.

## Sobre a rede Docker
Como os projetos usam arquivos `docker-compose.yml` separados, as redes criadas automaticamente por cada compose não são compartilhadas entre si. Por isso, para que os containers se comuniquem (ex: BFF acessando a API), é necessário criar manualmente uma rede Docker compartilhada.

**Crie a rede compartilhada apenas uma vez:**
```bash
docker network create wishlist-net
```
Depois disso, ambos os projetos poderão usar a mesma rede, bastando referenciar `wishlist-net` como `external: true` em seus composes.

> **Importante:** Se a rede não existir, o container do BFF não conseguirá se comunicar com a API pelo nome do serviço.
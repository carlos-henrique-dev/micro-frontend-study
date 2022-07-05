# Estudo sobre Micro frontend

Neste repositório encontra-se um pequeno estudo realizado para aprendizado sobre micro frontend. Ele conta com 3 micro aplicações:

- **listing-page:** lista os personagens da série Rick & Morty e permite que o usuário adicione e remova personagens da lista de favoritos. Esta aplicação também expõe uma instância do estado gerenciado pelo recoil e que é consumida pela `favorites-page` que consegue "visualizar" os cards que foram selecionados como favoritos na `listing-page`
- **favorites-page:** renderiza uma página com os personagens selecionados como favoritos pelo usuário e permite que ele os remova da lista;
- **remote:** exporta 2 componentes genéricos que são consumidos pelas 2 outras aplicações

## Stack utilizada

- React: 18
- Antd: 4.21
- Recoil: 0.7
- React Router Dom: 5

## Como rodar o projeto

Entre na pasta `remote` e execute o comando `yarn` para instalar as dependências e depois `yarn dev` para rodar

Entre na pasta `listing-page` e execute o comando `yarn` para instalar as dependências e depois `yarn start` para rodar

Entre na pasta `favorites-page` e execute o comando `yarn` para instalar as dependências e depois `yarn start` para rodar

---

## Detalhes da implementação

Abaixo estão alguns detalhes da implementação do projeto

### Compartilhamento de componentes

```javascript
// remote - webpack.config.js
const { dependencies } = require('./package.json')

 plugins: [
  new ModuleFederationPlugin({
      name: 'remote',
      filename: 'remoteEntry.js',
      exposes: {
        './CharactersCard': './src/components/CharactersCard',
        './Header': './src/components/Header',
      },
      shared: {
        ...dependencies,
        react: {
          singleton: true,
          eager: true,
          requiredVersion: dependencies['react'],
        },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: dependencies['react-dom'],
        },
      },
    }),
  ],
```

Para compartilhar os componentes genéricos `CharactersCard` e `Header` a aplicação `remote` utiliza o plugin `ModuleFederationPlugin` configurando o seu nome na rede, o arquivo que será gerado com o bundle, o nome e caminho dos componentes exportados e um objeto detalhando as dependências necessárias para executar os componentes

```javascript
// listing-page
// webpack.config.js
const { dependencies } = require('./package.json')

 plugins: [
 new ModuleFederationPlugin({
      name: 'listingPage',
      filename: 'remoteEntry.js',
      remotes: {
        remote: 'remote@http://localhost:3001/remoteEntry.js',
        favoritesPage: 'favoritesPage@http://localhost:3003/remoteEntry.js',
      },
      exposes: {
        './favorites': './src/data/favorites.ts',
      },
      shared: {
       // mesma configuração do snippet acima
      },
    })
  ],

// src/pages/List.tsx
const CharacterCard = React.lazy(() => import('remote/CharactersCard'))
```

De forma semelhante, a aplicação `listing-page` expõe os componentes compartilhados, com a adição da configuração de `remotes` que são os endereços remotos das aplicações que estão compartilhando informação.
Depois de configurado, para utilizar o componente remoto basta usar a importação dinâmica passando `chaveRemota/NomeDoComponente`.

---

### Safe component

```javascript
<SafeComponent>
  <CharacterCard character={character} actions={[ActionButton]} />
</SafeComponent>
```

No snippet acima temos o SafeComponent que envolve o CharacterCard.
CharacterCard é um componente remoto importado dinamicamente e que está sujeito à falhas. Por isto é necessário o uso do Wrapper "SafeComponent" que é um componente de classe que recebe um componente filho e fica verificando por erros, se algum erro acontecer na renderização ele exibe uma mensagem de aviso e evita que a árvore de componentes inteira seja afetada

### Lazy routes

```javascript
export const lazy = (componentImportFn: Function) =>
  React.lazy(async () => {
    const obj = await componentImportFn()

    return typeof obj.default === 'function' ? obj : obj.default
  })

const Favorites = lazy(() => import('favoritesPage/favoritesRoute'))

...
  <Route path="/favorites">
    <SafeComponent>
      <Favorites />
    </SafeComponent>
  </Route>
...
```

No snippet acima temos um exemplo de importação dinâmica de uma rota remota (favorites). Como a rota pode não estar disponível no momento da execução, então é utilizada uma [função genérica de importação](https://github.com/fuse-box/fuse-box/issues/1646#issuecomment-572242548) que permite importar o componente como constante e depois envolver ele em um SafeComponent

> Importante: Durante os testes de implementação tive dificuldades para importar todo o objeto de rota (`{path, component, exact, etc}`) remotamente e por isso importei apenas o componente. Cabe mais estudos para entender como implementar isso corretamente.

---

### Configuração do projeto

Um detalhe ao utilizar o module federation é que o arquivo index.tsx do react não pode manter o funcionamento padrão (importar os elementos iniciais e iniciar o projeto). Ele precisa apenas importar um arquivo que já faz isso, ficando assim:

```javascript
// src/bootstrap.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(<React.StrictMode><App /></React.StrictMode>)

// src/index.tsx
import('./bootstrap')

export {}
```

### Tipagem

Com o uso de componentes remotos o typescript não consegue entender bem a tipagem dos componentes e funções então é necessário o uso de um arquivo de definições

```javascript
// src/remote.d.ts

/// <reference types="react" />

declare module 'remote/CharactersCard' {
  const CharactersCard: React.FC<{
    character?: Character
    actions?: React.ReactNode[]
  }>

  export default CharactersCard
}
```

---

### Considerações

O uso do module federation permite isolar e desacoplar o código com mais facilidade.

Mas observei 2 pontos que precisam ser levados em consideração:

- **Repetição de código**: em alguns casos precisei repetir código como na declaração de tipagem, declaração do SafeComponent. Mas nesse caso acredito que o uso de uma biblioteca resolva isso, embora adicione outros detalhes como cuidado com versionamento da biblioteca, etc.

- **Mudança de configuração**: o module federation funciona sem problemas para projetos utilizando webpack 5, então para projetos com versões anteriores é necessário atualizar e fazer override de configurações e isso pode gerar alguns conflitos na hora de rodar o projeto novamente. Além do code-splitting que fica diferente ao usar o mf, por isso também é um ponto que deve ser considerado com cuidado

---

### Referências

- [Webpack module federation](https://webpack.js.org/concepts/module-federation/)
- [Intro to micro frontend](https://micro-frontends.org/)
- [Practical examples](https://github.com/module-federation/module-federation-examples)
- [Micro frontend tutorial](https://www.youtube.com/watch?v=lKKsjpH09dU&t=1906s)
- [State Management](https://www.youtube.com/watch?v=njXeMeAu4Sg&t=1573s)
- [Recoil state manager with module federation](https://www.youtube.com/watch?v=aHA581Mp2Mo&t=575s)

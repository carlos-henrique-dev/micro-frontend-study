# Study on Micro Frontend

In this repository, you will find a small study conducted for learning about micro frontend. It includes 3 micro applications:

- **listing-page**: Lists the characters from the series Rick & Morty and allows the user to add and remove characters from the favorites list. This application also exposes an instance of the state managed by recoil, which is consumed by the favorites-page that can "view" the cards selected as favorites in the listing-page.
  
- **favorites-page**: Renders a page with the characters selected as favorites by the user and allows them to remove characters from the list.

- **remote**: Exports 2 generic components that are consumed by the other 2 applications.

## Stack

- React: 18
- Antd: 4.21
- Recoil: 0.7
- React Router Dom: 5

## Running the project

### Installing dependencies

In the root of the project, run the command `npx concurrently "yarn:install-deps"` to install all dependencies for the 3 apps.

### Running the applications

In the root of the project, run the command `npx concurrently "yarn:start"` to run the 3 apps simultaneously.

---

## Implementation details

Below are some details of the project implementation.

### Component sharing

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

To share the generic components `CharactersCard` and `Header`, the `remote` application uses the `ModuleFederationPlugin` plugin by configuring its network name, the file that will be generated with the bundle, the name and path of the exported components, and an object detailing the dependencies required to run the components.

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

Similarly, the `listing-page` application exposes the shared components, with the addition of the `remotes` configuration, which are the remote addresses of the applications sharing information. After being configured, to use the remote component, you just need to use dynamic import by passing `remoteKey/ComponentName`.

---

### Safe component

```javascript
<SafeComponent>
  <CharacterCard character={character} actions={[ActionButton]} />
</SafeComponent>
```

In the snippet above, we have the SafeComponent wrapping the CharacterCard. CharacterCard is a dynamically imported remote component that is subject to failures. Therefore, it is necessary to use the "SafeComponent" wrapper, which is a class component that receives a child component and checks for errors. If any error occurs during rendering, it displays a warning message and prevents the entire component tree from being affected.

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

In the snippet above, we have an example of dynamic import of a remote route (favorites). Since the route may not be available at runtime, a [generic import function](https://github.com/fuse-box/fuse-box/issues/1646#issuecomment-572242548) is used, which allows importing the component as a constant and then wrapping it in a SafeComponent.

> Important: During implementation testing, I had difficulties importing the entire route object (`{path, component, exact, etc}`) remotely, so I imported only the component. Further studies are needed to understand how to implement this correctly.

---

### Project configuration

One detail when using module federation is that the index.tsx file of react cannot maintain the standard operation (importing the initial elements and starting the project). It needs to import a file that already does this, like this:

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

### Typing

With the use of remote components, TypeScript cannot understand the typing of components and functions well, so it is necessary to use a definitions file.

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

### Considerations

The use of module federation allows for easier isolation and decoupling of code.

But I observed 2 points that need to be considered:

- **Code repetition**: in some cases, I needed to repeat code such as in the typing declaration, declaration of SafeComponent. But in this case, I believe using a library solves this, although it adds other details such as library versioning, etc.
  
- **Configuration change**: module federation works without problems for projects using webpack 5, so for projects with previous versions, it is necessary to update and override configurations, which can cause some conflicts when running the project again. Also, the code-splitting is different when using mf, so this is also a point that should be carefully considered.

---

### References

- [Webpack module federation](https://webpack.js.org/concepts/module-federation/)
- [Intro to micro frontend](https://micro-frontends.org/)
- [Practical examples](https://github.com/module-federation/module-federation-examples)
- [Micro frontend tutorial](https://www.youtube.com/watch?v=lKKsjpH09dU&t=1906s)
- [State Management](https://www.youtube.com/watch?v=njXeMeAu4Sg&t=1573s)
- [Recoil state manager with module federation](https://www.youtube.com/watch?v=aHA581Mp2Mo&t=575s)

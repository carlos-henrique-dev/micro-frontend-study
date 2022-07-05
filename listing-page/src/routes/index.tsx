import React from 'react'
import { Layout } from 'antd'
import { Router, Switch, Route } from 'react-router-dom'
import { List } from '../pages'
import { createBrowserHistory } from 'history'
import { SafeComponent, FavoritesLink } from '../components'

const Header = React.lazy(() => import('remote/Header'))

export const lazy = (componentImportFn: Function) =>
  React.lazy(async () => {
    let obj = await componentImportFn()
    return typeof obj.default === 'function' ? obj : obj.default
  })

// @ts-ignore
const Favorites = lazy(() => import('favoritesPage/favoritesRoute'))

const history = createBrowserHistory()

console.log('fav', Favorites)

export function AppRouter() {
  return (
    <Layout>
      <Router history={history}>
        <SafeComponent>
          <Header title="Rick & Morty Listing" extra={[FavoritesLink]} />
        </SafeComponent>

        <Switch>
          <Route exact path="/">
            <List />
          </Route>

          <Route path="/favorites">
            <SafeComponent>
              <Favorites />
            </SafeComponent>
          </Route>
        </Switch>
      </Router>
    </Layout>
  )
}

import { Button, Col, Layout, Result, Row } from 'antd'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { SafeComponent } from '../components'
import { Character } from '../types/character'

// @ts-ignore
import { useFavorites } from 'listingPage/favorites'

const { Content } = Layout

const CharacterCard = React.lazy(() => import('remote/CharactersCard'))

function FavoritesPage() {
  const { favorites, removeFromFavorites } = useFavorites()

  const renderFavorites = useMemo(
    () =>
      favorites.map((character: Character) => {
        const RemoveButton = (
          <Button onClick={() => removeFromFavorites(character.id)} danger>
            Remove from favorites
          </Button>
        )
        return (
          <Col key={character.id}>
            <SafeComponent>
              <CharacterCard character={character} actions={[RemoveButton]} />
            </SafeComponent>
          </Col>
        )
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [favorites]
  )

  return (
    <Content style={{ padding: '30px 0' }}>
      <Row gutter={[16, 16]} justify="center">
        {favorites.length ? (
          renderFavorites
        ) : (
          <Result
            title="No favorites"
            subTitle="You don't have any favorite character to be displayed"
            status="info"
            extra={
              <Link to="/">
                <Button type="primary" key="console">
                  Go to Home
                </Button>
              </Link>
            }
          />
        )}
      </Row>
    </Content>
  )
}

export default FavoritesPage

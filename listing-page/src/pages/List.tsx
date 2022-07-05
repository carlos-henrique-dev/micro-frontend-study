import React, { useMemo } from 'react'
import { Button, Col, Layout, Row } from 'antd'

import { useGetCharacters } from '../hooks/use-get-characters'
import { Character } from '../types/character'

import { useFavorites } from '../data/favorites'
import { SafeComponent } from '../components'

const { Footer, Content } = Layout

const CharacterCard = React.lazy(() => import('remote/CharactersCard'))

export function List() {
  const { characters, loading, loadMore } = useGetCharacters<Character>()
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  const RenderCharacters = useMemo(() => {
    return characters.map((character) => {
      const addButton = <Button onClick={() => addToFavorites(character)}>Add to favorite</Button>
      const removeButton = (
        <Button onClick={() => removeFromFavorites(character.id)} danger>
          Remove from favorite
        </Button>
      )

      const ActionButton = isFavorite(character.id) ? removeButton : addButton

      return (
        <Col key={character.id}>
          <SafeComponent>
            <CharacterCard character={character} actions={[ActionButton]} />
          </SafeComponent>
        </Col>
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characters, favorites])

  return (
    <>
      <Content style={{ padding: '30px 0' }}>
        <Row gutter={[16, 16]} justify="center">
          {RenderCharacters}
        </Row>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        <Button loading={loading} onClick={loadMore}>
          Load more
        </Button>
      </Footer>
    </>
  )
}

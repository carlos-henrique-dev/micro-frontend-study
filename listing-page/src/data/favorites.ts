import { useCallback } from 'react'
import { useRecoilState, atom } from 'recoil'
import { Character } from '../types/character'

const favoritesAtom = atom<Character[]>({
  key: 'favorites',
  default: [],
})

export function useFavorites() {
  const [favorites, setFavorites] = useRecoilState(favoritesAtom)

  const addToFavorites = (character: Character) => {
    setFavorites((prev) => [...prev, character])
  }

  const removeFromFavorites = (id: number) => {
    const newFavorites = favorites.filter((character) => character.id !== id)

    setFavorites(newFavorites)
  }

  const isFavorite = useCallback((id: number) => favorites.find((char) => char.id === id), [favorites])

  return {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    favorites,
  }
}

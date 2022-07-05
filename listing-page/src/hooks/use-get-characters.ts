import { API } from '../common/http-service'
import { useEffect, useState } from 'react'

const getNextPage = (nextUrl: string) => {
  const url = new URL(nextUrl)
  const search = new URLSearchParams(url.search)
  const page = search.get('page')

  return page
}

export function useGetCharacters<T>() {
  const [characters, setCharacters] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [nextPage, setNextPage] = useState<null | string>(null)

  const getData = async () => {
    setLoading(true)
    const { data } = await API({ method: 'GET', url: '/character' })

    setCharacters(data.results)
    setLoading(false)
    setNextPage(getNextPage(data.info.next))
  }

  const loadMore = async () => {
    setLoading(true)
    const { data } = await API({ method: 'GET', url: `/character?page=${nextPage}` })

    setCharacters((prev) => [...prev, ...data.results])
    setLoading(false)
    setNextPage(getNextPage(data.info.next))
  }

  useEffect(() => {
    getData()
  }, [])

  return {
    characters,
    loading,
    loadMore,
  }
}

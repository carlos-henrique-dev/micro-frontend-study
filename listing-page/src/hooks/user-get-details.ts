import { useEffect, useState } from 'react'

export function useGetDetails(id: number) {
  const [data, setData] = useState(null)

  return {
    data,
  }
}

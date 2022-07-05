/// <reference types="react" />

declare module 'remote/CharactersCard' {
  const CharactersCard: React.FC<{
    character?: Character
    actions?: React.ReactNode[]
  }>

  export default CharactersCard
}

declare module 'remote/Header' {
  const Header: React.FC<{
    title: string
    extra?: any[]
  }>

  export default Header
}

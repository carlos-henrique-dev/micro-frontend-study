/// <reference types="react" />

declare module 'remote/CharactersCard' {
  const CharactersCard: React.FC<{
    character?: Character
    actions?: React.ReactNode[]
  }>

  export default CharactersCard
}

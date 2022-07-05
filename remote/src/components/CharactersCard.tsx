import React from 'react'
import 'antd/dist/antd.min.css'

import { Card } from 'antd'
import { Character } from '../types/character'

const { Meta } = Card

type Props = {
  character: Character
  actions?: React.ReactNode[]
}

function CharacterCard({ character, actions }: Props) {
  const { name, status, image } = character

  return (
    <Card hoverable style={{ width: 240 }} cover={<img alt={name} src={image} />} actions={actions}>
      <Meta title={name} description={status} />
    </Card>
  )
}

export default CharacterCard

import React from 'react'
import { Col, Layout, Row, Typography } from 'antd'
import { useMemo } from 'react'

import 'antd/dist/antd.min.css'

const { Header: AntdHeader } = Layout
const { Title } = Typography

type Props = {
  title: string
  extra?: any[]
}

function Header({ title, extra }: Props) {
  const getExtra = useMemo(() => {
    return extra?.map((item, index) => <span key={index}>{item}</span>)
  }, [extra])

  return (
    <AntdHeader>
      <Row align="middle" style={{ height: 64 }}>
        <Col flex="auto">
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            {title}
          </Title>
        </Col>

        <Col style={{ color: 'white' }}>{getExtra}</Col>
      </Row>
    </AntdHeader>
  )
}

export default Header

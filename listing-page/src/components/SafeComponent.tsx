import { Alert, Spin } from 'antd'
import React, { Component } from 'react'

type Props = {
  children: React.ReactNode
}

type State = {
  hasError: boolean
}

export class SafeComponent extends Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {}

  render() {
    const { hasError } = this.state
    const { children } = this.props

    if (hasError) {
      return <Alert message="Cannot load component" description="If the error persists, contact the support" type="error" />
    }

    return <React.Suspense fallback={<Spin tip="Loading..." />}>{children}</React.Suspense>
  }
}

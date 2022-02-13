import * as React from 'react'
import { styled } from '~styles'
import type { TDSnapshot } from '~types'
import { useTldrawApp } from '~hooks'
import { StatusBar } from './StatusBar'
import { BackToContent } from './BackToContent'
import { PrimaryTools } from './PrimaryTools'
import { ActionButton } from './ActionButton'
import { DeleteButton } from './DeleteButton'

const isDebugModeSelector = (s: TDSnapshot) => s.settings.isDebugMode

interface ToolsPanelProps {
  onBlur?: React.FocusEventHandler
}

export const ToolsPanel = React.memo(function ToolsPanel({ onBlur }: ToolsPanelProps): JSX.Element {
  const app = useTldrawApp()
  const isDebugMode = app.useStore(isDebugModeSelector)

  return (
    <StyledToolsPanelContainer onBlur={onBlur}>
      <StyledCenterWrap id="TD-Tools">
        {/* <BackToContent /> */}
        <StyledPrimaryTools>
          <ActionButton />
          <PrimaryTools />
          <DeleteButton />
        </StyledPrimaryTools>
      </StyledCenterWrap>
      {isDebugMode && (
        <StyledStatusWrap>
          <StatusBar />
        </StyledStatusWrap>
      )}
    </StyledToolsPanelContainer>
  )
})

const StyledToolsPanelContainer = styled('div', {
  display: 'grid',
  justifyContent: 'flex-start',
  alignSelf: 'center',
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  padding: '15 0',
  zIndex: 200,
  pointerEvents: 'none',
  '& > div > *': {
    pointerEvents: 'all',
  },
})

const StyledCenterWrap = styled('div', {
  gridRow: 1,
  gridColumn: 2,
  display: 'flex',
  width: 'fit-content',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '$4',
})

const StyledPrimaryTools = styled('div', {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  flexDirection: 'column',
})

const StyledStatusWrap = styled('div', {
  gridRow: 2,
  gridColumn: '1 / span 3',
})

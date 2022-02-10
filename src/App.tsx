import { Web3Provider } from '@ethersproject/providers'
import { ThemeProvider } from '@material-ui/styles'
import { Web3ReactProvider } from '@web3-react/core'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter } from 'react-router-dom'
import routes, { renderRoutes } from 'routes'
import { createGlobalTheme as createTheme } from 'theme'
import { ETHEME } from 'utils/enums'

import React from 'react'
import './App.scss'
import { ConnectedWeb3 } from 'contexts'

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function App() {
  const theme = createTheme(ETHEME.White)

  return (
    <ThemeProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          autoHideDuration={4000}
          maxSnack={3}
        >
          <ConnectedWeb3>
            <BrowserRouter>{renderRoutes(routes as never)}</BrowserRouter>
          </ConnectedWeb3>
        </SnackbarProvider>
      </Web3ReactProvider>
    </ThemeProvider>
  )
}

export default App

import { Provider } from 'react-redux'
import { store } from './stores/store'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Main } from './pages/Main'
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'NotoSans',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Main/>} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  )
}

export default App

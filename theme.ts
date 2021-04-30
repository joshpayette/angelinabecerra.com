import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { blue, red } from '@material-ui/core/colors'

export const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      background: {
        default: '#000',
        paper: '#101010',
      },
      primary: blue,
      secondary: red,
      type: 'dark',
    },
    typography: {
      fontFamily: 'Inter',
    },
  })
)

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AttendanceSystem from './AttendanceSystem';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AttendanceSystem />
    </ThemeProvider>
  );
}

export default App;

import { ThemeProvider, createTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
const theme = createTheme();

function App() {
  return (
    <div>
      <h1>Hallo World</h1>
      <Button variant="text">Click Me!</Button>
    </div>
  );
}

export default App;

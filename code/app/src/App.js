import { ThemeProvider, createTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
const theme = createTheme();

function App() {
  const loadData = async () => {
    try {
      const response = await fetch("http://localhost:3002/aiprompts");
      const aiPrompts = await response.json();
      console.log(aiPrompts);
    } catch (e) {
      alert(`Could not load AI Prompts`);
    }
  };

  return (
    <div>
      <h1>Hallo World</h1>
      <Button variant="text" onClick={loadData}>
        Click Me!
      </Button>
    </div>
  );
}

export default App;

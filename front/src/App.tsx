import { UserProvider } from "./contexts/UserConetxt";
import { Main } from "./pages/Main";

function App() {
  return (
    <UserProvider>
      <Main/>
    </UserProvider>
  );
}

export default App;

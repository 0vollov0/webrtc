import { UserProvider } from "./contexts/UserConetxt";
import { Main } from "./pages/Main";
import 'react-chat-widget/lib/styles.css';

function App() {
  return (
    <UserProvider>
      <Main/>
    </UserProvider>
  );
}

export default App;

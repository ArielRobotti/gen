import Header from "./components/Header";
import { SessionProvider } from "./context/sessionContext";

import './App.css';

function App() {
  return (
    <SessionProvider>
      <Header />
    </SessionProvider>
  );
}

export default App;

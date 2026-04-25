import AuthPage from "./pages/AuthPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import { useAuth } from "./store/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <ShoppingListPage /> : <AuthPage />;
}

export default App;

import { AuthProvider } from "../../store/AuthContext";
import { ShoppingListProvider } from "../../store/ShoppingListContext";

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ShoppingListProvider>{children}</ShoppingListProvider>
    </AuthProvider>
  );
}

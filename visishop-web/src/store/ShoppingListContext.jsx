import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  generateProductBarcode,
} from "../features/barcode/services/mockBarcodeScanner";

const ShoppingListContext = createContext(null);
const STORAGE_KEY_V1 = "visishop.products.v1";
const STORAGE_KEY_V2 = "visishop.products.v2";

const seedProducts = [];

const initialState = {
  products: seedProducts,
};

function sanitizeProducts(rawProducts) {
  if (!Array.isArray(rawProducts)) return [];

  const sanitized = rawProducts
    .filter((item) => item && typeof item.name === "string")
    .map((item) => {
      const name = item.name.trim();
      const status = item.status === "verified" ? "verified" : "pending";
      const barcode = String(item.barcode || generateProductBarcode(name)).trim();

      return {
        id: item.id || `prd-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
        name,
        status,
        barcode,
        isScanning: false,
        scanFeedback: null,
      };
    })
    .filter((item) => item.name.length > 0);

  return sanitized;
}

function getInitialState() {
  if (typeof window === "undefined") return initialState;

  try {
    const serializedV2 = window.localStorage.getItem(STORAGE_KEY_V2);
    if (serializedV2) {
      const parsed = JSON.parse(serializedV2);
      return { products: sanitizeProducts(parsed.products) };
    }

    const serializedV1 = window.localStorage.getItem(STORAGE_KEY_V1);
    if (!serializedV1) return initialState;

    const parsedV1 = JSON.parse(serializedV1);
    const migratedProducts = sanitizeProducts(parsedV1);
    window.localStorage.setItem(
      STORAGE_KEY_V2,
      JSON.stringify({
        version: 2,
        products: migratedProducts,
        migratedAt: new Date().toISOString(),
      })
    );
    window.localStorage.removeItem(STORAGE_KEY_V1);

    return {
      products: migratedProducts,
    };
  } catch {
    return initialState;
  }
}

function shoppingListReducer(state, action) {
  switch (action.type) {
    case "ADD_PRODUCT": {
      const newProduct = {
        id: `prd-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
        name: action.payload.name,
        status: "pending",
        barcode: action.payload.barcode,
        isScanning: false,
        scanFeedback: null,
      };

      return {
        ...state,
        products: [newProduct, ...state.products],
      };
    }
    case "SCAN_START":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id
            ? { ...product, isScanning: true, scanFeedback: null }
            : product
        ),
      };
    case "SCAN_FINISH":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id
            ? {
                ...product,
                status: action.payload.isMatch ? "verified" : product.status,
                isScanning: false,
                scanFeedback: {
                  type: action.payload.isMatch ? "success" : "error",
                  scannedCode: action.payload.scannedCode,
                  expectedCode: action.payload.expectedCode,
                  message: action.payload.isMatch
                    ? "Codigo verificado correctamente."
                    : "El codigo no coincide con este producto.",
                },
              }
            : product
        ),
      };
    case "SCAN_CANCEL":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id
            ? { ...product, isScanning: false }
            : product
        ),
      };
    case "CLEAR_PRODUCTS":
      return {
        ...state,
        products: [],
      };
    default:
      return state;
  }
}

export function ShoppingListProvider({ children }) {
  const [state, dispatch] = useReducer(shoppingListReducer, initialState, getInitialState);

  function addProduct(payload) {
    const isObjectPayload = payload && typeof payload === "object";
    const normalizedName = String(
      isObjectPayload ? payload.name : payload
    ).trim();
    const normalizedBarcode = String(
      isObjectPayload ? payload.barcode : generateProductBarcode(normalizedName)
    ).trim();
    if (!normalizedName || !normalizedBarcode) return;

    dispatch({
      type: "ADD_PRODUCT",
      payload: {
        name: normalizedName,
        barcode: normalizedBarcode,
      },
    });
  }

  function normalizeCode(rawCode) {
    return String(rawCode || "").trim().replace(/\s/g, "");
  }

  function verifyScannedProduct(id, scannedCode) {
    const targetProduct = state.products.find((product) => product.id === id);
    if (!targetProduct) return;

    const expectedCode = normalizeCode(targetProduct.barcode);
    const receivedCode = normalizeCode(scannedCode);
    const isMatch = expectedCode === receivedCode;

    dispatch({
      type: "SCAN_FINISH",
      payload: {
        id,
        isMatch,
        scannedCode: receivedCode || "sin-codigo",
        expectedCode,
      },
    });
  }

  function startProductScan(id) {
    dispatch({ type: "SCAN_START", payload: { id } });
  }

  function cancelProductScan(id) {
    dispatch({ type: "SCAN_CANCEL", payload: { id } });
  }

  function clearProducts() {
    dispatch({ type: "CLEAR_PRODUCTS" });
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const persistableProducts = state.products.map((product) => ({
      id: product.id,
      name: product.name,
      status: product.status,
      barcode: product.barcode,
    }));

    window.localStorage.setItem(
      STORAGE_KEY_V2,
      JSON.stringify({
        version: 2,
        products: persistableProducts,
        updatedAt: new Date().toISOString(),
      })
    );
  }, [state.products]);

  const value = useMemo(
    () => ({
      products: state.products,
      addProduct,
      startProductScan,
      cancelProductScan,
      verifyScannedProduct,
      clearProducts,
    }),
    [state.products]
  );

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error("useShoppingList must be used inside ShoppingListProvider.");
  }
  return context;
}

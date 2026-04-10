import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { DEFAULT_API_BASE_URL } from './src/config';


async function apiFetch(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!response.ok) {
    const message = data?.msg || data?.error || `Error HTTP ${response.status}`;
    throw new Error(message);
  }

  return data;
}


function Section({ title, subtitle, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}


function Field({ label, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput placeholderTextColor="#6b7280" style={styles.input} {...props} />
    </View>
  );
}


function Button({ label, onPress, variant = 'primary', disabled = false, compact = false }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        compact ? styles.buttonCompact : null,
        variant === 'secondary' ? styles.buttonSecondary : styles.buttonPrimary,
        disabled ? styles.buttonDisabled : null,
        pressed && !disabled ? styles.buttonPressed : null,
      ]}
    >
      <Text style={variant === 'secondary' ? styles.buttonTextSecondary : styles.buttonTextPrimary}>{label}</Text>
    </Pressable>
  );
}


export default function App() {
  const [apiBaseUrl, setApiBaseUrl] = useState(DEFAULT_API_BASE_URL);
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('test');
  const [password, setPassword] = useState('1234');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [catalogName, setCatalogName] = useState('');
  const [catalogCode, setCatalogCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [products, setProducts] = useState([]);
  const [listItems, setListItems] = useState([]);
  const [scanTarget, setScanTarget] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  async function loadData(showLoader = true) {
    if (!token) {
      return;
    }

    try {
      if (showLoader) {
        setRefreshing(true);
      }

      const headers = { Authorization: `Bearer ${token}` };
      const [catalogData, listData] = await Promise.all([
        apiFetch(apiBaseUrl, '/api/productos', { headers }),
        apiFetch(apiBaseUrl, '/api/lista', { headers }),
      ]);
      setProducts(catalogData);
      setListItems(listData);
    } catch (error) {
      Alert.alert('No se pudo actualizar', error.message);
    } finally {
      if (showLoader) {
        setRefreshing(false);
      }
    }
  }

  useEffect(() => {
    loadData();
  }, [token, apiBaseUrl]);

  async function submitAuth() {
    try {
      setLoading(true);

      if (mode === 'register') {
        await apiFetch(apiBaseUrl, '/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
      }

      const loginData = await apiFetch(apiBaseUrl, '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      setToken(loginData.token);
    } catch (error) {
      Alert.alert('Error de autenticacion', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function createProduct() {
    try {
      setLoading(true);
      await apiFetch(apiBaseUrl, '/api/productos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: catalogName, codigo_barras: catalogCode }),
      });
      setCatalogName('');
      setCatalogCode('');
      await loadData(false);
    } catch (error) {
      Alert.alert('No se pudo crear el producto', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function createListItem() {
    try {
      setLoading(true);
      await apiFetch(apiBaseUrl, '/api/lista', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: itemName }),
      });
      setItemName('');
      await loadData(false);
    } catch (error) {
      Alert.alert('No se pudo guardar el item', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function openScanner(item) {
    const permission = cameraPermission?.granted
      ? cameraPermission
      : await requestCameraPermission();

    if (!permission?.granted) {
      Alert.alert('Permiso requerido', 'Necesitas habilitar la camara para escanear codigos.');
      return;
    }

    setScanTarget(item);
    setCameraVisible(true);
  }

  async function verifyCode(code) {
    if (!scanTarget) {
      return;
    }

    try {
      setLoading(true);
      const result = await apiFetch(apiBaseUrl, `/api/lista/${scanTarget.id}/verificar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo_barras: code }),
      });

      await loadData(false);

      Alert.alert(
        result.coincide ? 'Producto verificado' : 'No coincide',
        result.coincide
          ? `${result.producto_escaneado.nombre} coincide con ${scanTarget.nombre_ingresado}.`
          : `${result.producto_escaneado.nombre} no coincide con ${scanTarget.nombre_ingresado}.`
      );
    } catch (error) {
      Alert.alert('No se pudo verificar', error.message);
    } finally {
      setLoading(false);
      setCameraVisible(false);
      setScanTarget(null);
    }
  }

  function renderAuth() {
    return (
      <Section title="Ingreso" subtitle="Conectate al backend Flask para probar el MVP.">
        <Field
          label="Backend URL"
          value={apiBaseUrl}
          onChangeText={setApiBaseUrl}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="http://192.168.0.10:5000"
        />
        <Text style={styles.helpText}>En Expo Go no uses `localhost`; usa la IP LAN de tu PC.</Text>
        <View style={styles.modeRow}>
          <Button label="Login" variant={mode === 'login' ? 'primary' : 'secondary'} onPress={() => setMode('login')} />
          <Button label="Registro" variant={mode === 'register' ? 'primary' : 'secondary'} onPress={() => setMode('register')} />
        </View>
        <Field label="Usuario" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Button label={loading ? 'Procesando...' : 'Continuar'} onPress={submitAuth} disabled={loading} />
      </Section>
    );
  }

  function renderDashboard() {
    return (
      <>
        <Section title="Sesion activa" subtitle={`Usuario: ${username}`}>
          <Text style={styles.helpText}>Backend conectado: {apiBaseUrl}</Text>
          <View style={styles.modeRow}>
            <Button label={refreshing ? 'Actualizando...' : 'Actualizar'} onPress={() => loadData()} disabled={refreshing || loading} />
            <Button
              label="Salir"
              variant="secondary"
              onPress={() => {
                setToken('');
                setProducts([]);
                setListItems([]);
              }}
            />
          </View>
        </Section>

        <Section title="Catalogo maestro" subtitle="Carga productos con su codigo para poder validarlos despues.">
          <Field label="Nombre del producto" value={catalogName} onChangeText={setCatalogName} />
          <Field
            label="Codigo escaneable"
            value={catalogCode}
            onChangeText={setCatalogCode}
            keyboardType="number-pad"
          />
          <Button
            label={loading ? 'Guardando...' : 'Guardar producto'}
            onPress={createProduct}
            disabled={loading || !catalogName.trim() || !catalogCode.trim()}
          />
          {products.map((product) => (
            <View key={product.id} style={styles.cardRow}>
              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>{product.nombre}</Text>
                <Text style={styles.cardMeta}>Codigo: {product.codigo_barras}</Text>
              </View>
            </View>
          ))}
        </Section>

        <Section title="Lista del usuario" subtitle="Hoy el MVP funciona bien con carga manual y escaneo.">
          <Field label="Producto pedido" value={itemName} onChangeText={setItemName} placeholder="Ej: Leche" />
          <Button
            label={loading ? 'Guardando...' : 'Agregar a la lista'}
            onPress={createListItem}
            disabled={loading || !itemName.trim()}
          />
          <View style={styles.voiceNotice}>
            <Text style={styles.voiceNoticeTitle}>Voz</Text>
            <Text style={styles.helpText}>
              El backend actual todavia no esta listo para Expo Go en voz real porque la app graba en `m4a` y el servidor hoy transcribe archivos tipo `wav/aiff/flac`.
            </Text>
          </View>
          {listItems.map((item) => (
            <View key={item.id} style={styles.cardRow}>
              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>{item.nombre_ingresado}</Text>
                <Text style={styles.cardMeta}>{item.verificado ? 'Verificado' : 'Pendiente de escaneo'}</Text>
                {item.producto ? <Text style={styles.cardMeta}>Escaneado: {item.producto.nombre}</Text> : null}
              </View>
              <Button label="Escanear" onPress={() => openScanner(item)} disabled={loading} />
            </View>
          ))}
        </Section>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      {cameraVisible ? (
        <View style={styles.cameraScreen}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'],
            }}
            onBarcodeScanned={
              loading || !scanTarget
                ? undefined
                : ({ data }) => {
                    setCameraVisible(false);
                    verifyCode(data);
                  }
            }
          />
          <View style={styles.cameraOverlay} pointerEvents="box-none">
            <View style={styles.cameraHeader}>
              <Text style={styles.cameraBadge}>Escaner activo</Text>
              <Text style={styles.cameraTitle}>Escaneando {scanTarget?.nombre_ingresado}</Text>
              <Text style={styles.cameraSubtitle}>Centra el codigo de barras dentro del marco para validar el producto.</Text>
            </View>

            <View style={styles.scannerMask} pointerEvents="none">
              <View style={styles.maskMiddleRow}>
                <View style={styles.scanFrame}>
                  <View style={[styles.scanCorner, styles.scanCornerTopLeft]} />
                  <View style={[styles.scanCorner, styles.scanCornerTopRight]} />
                  <View style={[styles.scanCorner, styles.scanCornerBottomLeft]} />
                  <View style={[styles.scanCorner, styles.scanCornerBottomRight]} />
                  <View style={styles.scanLine} />
                </View>
              </View>
            </View>

            <View style={styles.cameraBottomSheet}>
              <View style={styles.cameraBottomText}>
                <Text style={styles.cameraBottomTitle}>Lectura inteligente</Text>
                <Text style={styles.cameraBottomSubtitle}>Acerca y aleja el producto lentamente hasta que el codigo entre completo en el recuadro.</Text>
              </View>
              {loading ? <ActivityIndicator size="large" color="#22c55e" /> : null}
              <Button label="Cancelar" variant="secondary" compact onPress={() => setCameraVisible(false)} />
            </View>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Text style={styles.headerEyebrow}>Visishop MVP</Text>
          <Text style={styles.headerTitle}>Lista por usuario y verificacion con camara</Text>
          <Text style={styles.headerText}>
            Esta app Expo Go ya se conecta al backend para login, carga manual de productos y verificacion por escaneo.
          </Text>
          {token ? renderDashboard() : renderAuth()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#07111f',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  headerEyebrow: {
    color: '#67e8f9',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 34,
  },
  headerText: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 12,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderRadius: 16,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#334155',
    color: '#f8fafc',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  helpText: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 19,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    minHeight: 46,
    borderRadius: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonCompact: {
    flex: 0,
  },
  buttonPrimary: {
    backgroundColor: '#22c55e',
  },
  buttonSecondary: {
    backgroundColor: '#e2e8f0',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonTextPrimary: {
    color: '#052e16',
    fontWeight: '700',
    fontSize: 15,
  },
  buttonTextSecondary: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 15,
  },
  cardRow: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    gap: 12,
  },
  cardTextWrap: {
    gap: 4,
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  cardMeta: {
    color: '#94a3b8',
    fontSize: 13,
  },
  voiceNotice: {
    borderRadius: 18,
    backgroundColor: '#101826',
    borderWidth: 1,
    borderColor: '#1d4ed8',
    padding: 14,
    gap: 6,
  },
  voiceNoticeTitle: {
    color: '#bfdbfe',
    fontSize: 14,
    fontWeight: '700',
  },
  cameraScreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
  },
  cameraHeader: {
    gap: 10,
  },
  cameraBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    color: '#67e8f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  cameraTitle: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  cameraSubtitle: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 320,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  scannerMask: {
    flex: 1,
    justifyContent: 'center',
  },
  maskMiddleRow: {
    width: '100%',
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 290,
    height: 190,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    overflow: 'hidden',
  },
  scanCorner: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderColor: '#ffffff',
  },
  scanCornerTopLeft: {
    top: 14,
    left: 14,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  scanCornerTopRight: {
    top: 14,
    right: 14,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  scanCornerBottomLeft: {
    bottom: 14,
    left: 14,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  scanCornerBottomRight: {
    bottom: 14,
    right: 14,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  scanLine: {
    position: 'absolute',
    left: 26,
    right: 26,
    top: '50%',
    height: 2,
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  cameraBottomSheet: {
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    gap: 16,
  },
  cameraBottomText: {
    gap: 6,
  },
  cameraBottomTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
  cameraBottomSubtitle: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
});

# Visishop

Este workspace contiene dos partes:

- `Visishop/`: backend Flask con autenticación, catálogo, listas de usuario y verificación de códigos escaneados.
- `visishop-mobile/`: frontend Expo/React Native para probar el MVP en Expo Go.

## Instalación y puesta en marcha

### Backend (`Visishop/`)

Requisitos:
- Python 3.10 +  
- `pip` (normalmente incluido con Python)
- `git` (para clonar el repositorio)

Pasos:

1. Clonar el repositorio  
   ```bash
   git clone https://github.com/tu_usuario/Visishop-backend.git
   cd Visishop-backend/Visishop
   ```

2. Crear entorno virtual  
   ```powershell
   python -m venv venv
   ```

3. Activar el entorno  
   ```powershell
   .\venv\Scripts\Activate.ps1   # PowerShell
   # o
   source venv/Scripts/activate  # Bash
   ```

4. Instalar dependencias  
   ```bash
   pip install -r requirements.txt
   ```

5. Configurar variables de entorno (opcional)  
   - Copia el fichero `.env.example` si existe y renómbralo a `.env`.  
   - Por defecto se usará una base de datos SQLite en `visishop.db`.

6. Levantar el servidor  
   ```bash
   python app.py
   # o
   # boot.sh en Linux/Unix
   ```

El backend escuchará en `http://127.0.0.1:5000` por defecto.

### Frontend (`visishop-mobile/`)

Requisitos:
- Node ≥ 18 LTS
- `npm` o `yarn`
- Expo CLI (`npm install -g expo-cli`)

Pasos:

1. Instalar dependencias  
   ```bash
   cd visishop-mobile
   npm install
   ```

2. Ajustar la URL del backend  
   - Edita `src/config.js` con la IP LAN de tu computadora:  
     ```js
     const SERVER_URL = 'http://192.168.0.15:5000';
     ```

3. Iniciar el cliente  
   ```bash
   npm start
   ```

4. Abrir la aplicación con Expo Go en tu móvil o emulador (Android / iOS).

## Notas

- Cuando uses el backend en producción, configura `FLASK_ENV=production` y un `SECRET_KEY` seguro.
- En dispositivos móviles, no uses `localhost` para apuntar al backend; usa la IP LAN o un túnel (ngrok, localtunnel, etc.).
- La cámara requiere permisos en el dispositivo para escanear códigos QR.

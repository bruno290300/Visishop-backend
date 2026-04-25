# Visishop Mobile

Frontend MVP en Expo Go diseñado para consumir el backend de Visishop.

## Flujo disponible
- Login y registro.
- Alta de productos al catálogo maestro.
- Alta manual de ítems a la lista del usuario.
- Escaneo de código QR para verificar coincidencia con el item pedido.

## Pendiente para voz real en Expo Go
El backend actual transcribe audio tipo `wav/aiff/flac`, pero Expo Go normalmente graba `m4a`. Para tener voz end-to-end hay que adaptar el backend para aceptar `m4a` o cambiar la estrategia de transcripción.

## Arranque
1. Instalar dependencias del backend y levantar Flask (ver la sección **Backend** en la README raíz).  
2. Instalar dependencias del frontend:
   ```bash
   cd visishop-mobile
   npm install
   ```
3. Ajustar la URL del backend editando `src/config.js` con la IP LAN de tu PC, por ejemplo:
   ```js
   const SERVER_URL = 'http://192.168.0.15:5000';
   ```
4. Iniciar el cliente con Expo:
   ```bash
   npm start
   ```
5. Abrir el proyecto con Expo Go en tu móvil o emulador (Android / iOS).

## Notas
- En dispositivos móviles no uses `localhost`; apunta al backend con la IP LAN o un túnel.
- La cámara necesita permisos para escanear códigos.

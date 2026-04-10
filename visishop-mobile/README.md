# Visishop Mobile

Frontend MVP en Expo Go para probar el backend de Visishop.

## Flujo disponible

- Login y registro
- Alta de productos al catalogo maestro
- Alta manual de items a la lista del usuario
- Escaneo de codigo para verificar si coincide con el item pedido

## Pendiente para voz real en Expo Go

El backend actual transcribe audio tipo `wav/aiff/flac`, pero Expo Go normalmente graba `m4a`. Para tener voz end-to-end hay que adaptar el backend para aceptar `m4a` o cambiar la estrategia de transcripcion.

## Arranque

1. Instalar dependencias del backend y levantar Flask.
2. Editar `src/config.js` con la IP LAN de tu PC, por ejemplo `http://192.168.0.15:5000`.
3. Ejecutar `npm start`.
4. Abrir el proyecto con Expo Go.

## Notas

- En celular no uses `localhost` para apuntar al backend.
- La camara necesita permisos para escanear.

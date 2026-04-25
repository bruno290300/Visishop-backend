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



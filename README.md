# Fútbol del Futuro - Vercel Backend (Crear Usuario)

Este proyecto es un endpoint de backend en Vercel para crear usuarios en Supabase de forma segura desde tu app Expo/React Native.

## 📁 Estructura

- `/api/create-user.ts`: Crea un usuario en Supabase Auth + lo inserta en la tabla `usuarios`.
- `vercel.json`: Define la ruta de API.
- `package.json`: Manejo de dependencias.
- `.env`: Llaves privadas (no subir).
- `README.md`: Instrucciones.

## 🚀 ¿Cómo usar?

1. Crea un nuevo repositorio en GitHub.
2. Sube todos estos archivos.
3. Conecta el repositorio a [vercel.com](https://vercel.com).
4. En Vercel > Settings > Environment Variables añade:

```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

5. Espera a que despliegue. Vercel te dará una URL como:
   `https://tuapp.vercel.app/api/create-user`

6. Desde tu app Expo, haz un `fetch` POST con:

```ts
await fetch('https://tuapp.vercel.app/api/create-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'nuevo@correo.com',
    password: 'clave123',
    nombre: 'Nombre',
    rol_principal: 'entrenador',
    roles: ['entrenador'],
    equipo_id: 'xxx',
    categoria_id: 'yyy'
  })
});
```

---
**⚠️ IMPORTANTE:** Nunca pongas `SUPABASE_SERVICE_ROLE_KEY` en el frontend.

# Star Wars · El legado de la Fuerza

Experiencia web cinematográfica en formato de diapositivas que recorre los Episodios I al VI e integra *The Clone Wars*, *Obi-Wan Kenobi* y *Star Wars Rebels* en una sola línea temporal.

## Controles

- Deslizar, usar la rueda o las flechas para avanzar.
- Usar la línea temporal lateral para saltar entre capítulos.
- Activar el sonido desde la esquina superior derecha.
- La animación se reduce automáticamente si el dispositivo tiene activada la preferencia de movimiento reducido.

## Imágenes

Las nueve escenas usan fotografías espaciales de [Unsplash](https://unsplash.com/s/photos/galaxy-space) con capas de color y composición propias. Para reemplazar cualquiera, edita el campo `image` del capítulo correspondiente en `app/page.tsx`; funcionan URLs remotas o rutas locales como `/images/episodio-1.jpg`.

## Desarrollo local

```bash
npm install
npm run dev
npm test
```

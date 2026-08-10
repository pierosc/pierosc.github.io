# Star Wars · El legado de la Fuerza

Ruta principal: `/star-wars`

Experiencia web cinematográfica de 38 archivos narrativos que explica los Episodios I al VI e integra *The Clone Wars*, *Obi-Wan Kenobi*, el ascenso del Imperio, *Star Wars Rebels* y *Rogue One* en una sola línea temporal. La versión ampliada desarrolla la organización del ejército clon, Satine y Obi-Wan, la conquista de Mandalore por Maul, el entrenamiento y la supervivencia de Ahsoka, Rex, el Inquisitorius, los planes de Palpatine, la creación de la Alianza Rebelde y el recorrido de los planos de la Estrella de la Muerte hasta Leia.

## Controles

- Deslizar, usar la rueda o las flechas para avanzar.
- Usar la línea temporal lateral para saltar entre capítulos.
- Activar el sonido desde la esquina superior derecha.
- La animación se reduce automáticamente si el dispositivo tiene activada la preferencia de movimiento reducido.

## Editar la historia

Todo el contenido narrativo y visual está centralizado en `app/story.json`: introducción, capítulos, párrafos, citas, hitos, colores e imágenes. Después de editarlo, ejecuta `npm run story:text` para regenerar `HISTORIA.md` en formato de lectura.

## Imágenes

Las escenas usan fotografías espaciales de [Unsplash](https://unsplash.com/s/photos/galaxy-space) con capas de color y composición propias. Para reemplazar cualquiera, edita el campo `image` del capítulo correspondiente en `app/story.json`; funcionan URLs remotas o rutas locales como `/images/episodio-1.jpg`.

## Desarrollo local

```bash
npm install
npm run dev
npm test
```

## Docker

```bash
docker compose up -d --build
```

La experiencia queda disponible en `http://localhost:8080`. Para detenerla:

```bash
docker compose down
```

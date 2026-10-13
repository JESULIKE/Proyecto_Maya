# Libro interactivo: diseño pedagógico

Rediseñado como *intelligent textbook*. Código: `lib/maya/textbook/` (lógica pura, con pruebas), `components/book/`, `pages/textbook/`.

## Qué hace que sea «inteligente»
| Requisito | Cómo se cumple |
|---|---|
| Modelo del dominio | 7 conceptos con prerrequisitos (`CONCEPTS` en `curriculum.js`) |
| Modelo del contenido | Cada lección está etiquetada con los conceptos que cubre |
| Modelo del estudiante | Dominio por concepto (superpuesto al dominio), racha, caja de repaso (`learner.js`) |
| Navegación adaptativa | El estudiante elige libremente; el libro **recomienda** y avisa de prerrequisitos sin bloquear |
| Presentación adaptativa | Pistas por nivel: Aprendiz (visible), Autónomo (a pedido), Súper Pro (sin pistas visuales) |
| Retroalimentación formativa | Explica el porqué, nunca castiga; tras un fallo la ayuda siempre aumenta |
| Práctica de recuperación espaciada | «Repaso» con cajas de Leitner (0, 1, 3, 7 y 14 días) |
| Práctica variada | Elegir glifo, leer glifo, unir parejas, bloques, orden de lectura y escribir palabras |
| Ejemplo resuelto que se desvanece | «Escribe con glifos»: se completa una sílaba, luego toda la palabra, luego sin sonidos |
| Modelo abierto del estudiante | «Mi progreso» y glifos que se revelan al dominar cada concepto |
| Accesibilidad | Tamaño de letra, espaciado, contraste, lectura en voz alta, teclado y lector de pantalla |

## Reglas de K'in que se respetan
Sin rojo, cronómetros, vidas, rankings ni rachas visibles; pistas que se retiran tras 3 aciertos seguidos (RF-04); anonimato (apodo opcional, todo se guarda en el dispositivo).

## Umbrales (propuesta, ajustables en `learner.js`)
Pista reducida a los 3 aciertos seguidos; sin pistas visuales a los 6; dominio ≥ 80 % y racha ≥ 3 para «revelar» el glifo.

## Contenido y límites
- Hechos limitados a lo básico y establecido: escritura logosilábica, bloques, signo principal y afijos, lectura en columnas pareadas, *b'alam* como logograma o *b'a-la-ma*.
- El catálogo de glifos solo tiene sílabas (no logogramas), así que no hay glifo de Tz'ib' ni de *b'alam* como logograma.
- Las palabras «de práctica» están marcadas como tales. Contenido pendiente de validación epigráfica.

## Fuentes consultadas
- Brusilovsky, Sosnovsky y Thaker, «The return of intelligent textbooks», AI Magazine (2022): modelo del dominio, del contenido y del estudiante; navegación adaptativa.
- Education Endowment Foundation: práctica de recuperación y ejemplos resueltos con desvanecimiento hacia atrás.
- Diseño de K'in (E1 RF-04, E2, E3) del vault del proyecto.
- Sobre bloques de glifos y orden de lectura: mayaarchaeologist.co.uk y Wikipedia «Maya script» (verificar con epigrafistas).

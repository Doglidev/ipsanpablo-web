# 📋 MIGRATION SPEC - Contenido IPS San Pablo

**Objetivo**: Cargar todo el contenido real del sitio viejo en la base de datos.

**Todas las imágenes están en**: `public/imagenes/` con los nombres exactos que se indican abajo.

---

## 🔧 CONFIGURACIÓN GENERAL DEL SITIO (SiteConfig)

Actualizar el registro de `SiteConfig` (id: 'main') con estos datos:

```javascript
{
  schoolName: "Instituto Parroquial San Pablo Apóstol",
  phone: "(0351) XXX-XXXX", // Buscar número real o dejarlo así
  email: "secretaria@ipsanpablo.com",
  address: "Asturias 1935, Barrio Colón, Córdoba",
  heroTitle: "Instituto Parroquial San Pablo Apóstol",
  heroSubtitle: "Educación con valores desde 1959",
  inscripcionOpen: false,
  inscripcionText: "Las inscripciones para el ciclo lectivo 2026 estarán abiertas próximamente."
}
```

---

## 📄 SECCIONES A ACTUALIZAR

### 1. INSTITUCIONAL - Nuestra Escuela (slug: "nuestra-escuela")

**Imagen destacada**: `public/imagenes/institucional-img.png`

**Contenido en formato de bloques**:

```json
{
  "blocks": [
    {
      "id": "block_1",
      "type": "heading",
      "data": { "text": "Objetivo Institucional", "level": 2 }
    },
    {
      "id": "block_2",
      "type": "paragraph",
      "data": {
        "text": "Promover como Comunidad Educativa la formación integral de cada alumno y alumna como persona consciente, libre, responsable y abierta a la verdad a través de una Pedagogía Cristocéntrica y de una Mística Paulina que atienda al logro de la síntesis FE, CULTURA y VIDA, y lo haga capaz de participar activamente, humanizando y cristianizando la sociedad en la que vive."
      }
    },
    {
      "id": "block_3",
      "type": "heading",
      "data": { "text": "Persona", "level": 2 }
    },
    {
      "id": "block_4",
      "type": "paragraph",
      "data": {
        "text": "Creada a la imagen de Dios, el ser humano tiene la dignidad de persona. Es alguien capaz de conocerse, de poseerse, de darse libremente y entrar en comunión con otras personas; y es llamado, por la gracia a una alianza con el Creador, a ofrecerle una respuesta de fe y amor."
      }
    },
    {
      "id": "block_5",
      "type": "heading",
      "data": { "text": "Educación", "level": 2 }
    },
    {
      "id": "block_6",
      "type": "paragraph",
      "data": {
        "text": "El objetivo de la educación es el de humanizar y personalizar al hombre, orientándolo eficazmente hacia su fin último que trasciende de la finitud esencial del hombre. La educación ha de ser personalista, personalizada y personalizante. La Escuela Católica tiene por fin la comunicación sistemática y crítica de la cultura, para la formación integral de la persona. Persigue este fin dentro de una visión humanista de la realidad, tendiendo a formar al Cristiano en las virtudes que lo configuran con Cristo, su modelo y le permiten colaborar en la edificación del Reino."
      }
    },
    {
      "id": "block_7",
      "type": "heading",
      "data": { "text": "Estilo de Enseñanza y Aprendizaje", "level": 2 }
    },
    {
      "id": "block_8",
      "type": "paragraph",
      "data": {
        "text": "Entendemos el estilo de enseñanza y aprendizaje como la formalización de la manera de enseñar y aprender en la escuela."
      }
    },
    {
      "id": "block_9",
      "type": "paragraph",
      "data": {
        "text": "Los rasgos de la Pedagogía Paulina que sostienen nuestro estilo de enseñanza y aprendizaje son:"
      }
    },
    {
      "id": "block_10",
      "type": "list",
      "data": {
        "style": "unordered",
        "items": [
          "La centralidad del alumno y alumna, meta, sentido y base de la propuesta educativa.",
          "La personalización, en tanto está dirigida a entender a la particular idiosincrasia de cada persona en su realidad única e irrepetible.",
          "Los contenidos evangelizados y evangelizadores, en orden a la relación entre la cultura, la fe y la vida.",
          "La educación significativa, orientando los contenidos, los saberes, los procedimientos, los valores y principios, a la propia existencia de los educandos.",
          "Los valores cristianos como principios reguladores del proceso educativo son orientadores de la tarea educativa.",
          "El proceso escolar inscrito dentro de la formación permanente de las personas.",
          "La comunidad educativa en tanto educadora, desde contenidos, modos, procedimientos y valores que transmite."
        ]
      }
    },
    {
      "id": "block_11",
      "type": "heading",
      "data": { "text": "Comunidad Educativa", "level": 2 }
    },
    {
      "id": "block_12",
      "type": "paragraph",
      "data": {
        "text": "Se define por el reconocimiento y valoración de cada uno de sus miembros: alumnos, docentes y no docentes, directivos, padres y madres, personal administrativo, de limpieza, de seguridad y mantenimiento, quienes participan de un modo específico y particular de la misión y objetivos institucionales."
      }
    },
    {
      "id": "block_13",
      "type": "heading",
      "data": { "text": "Nuestro Patrono", "level": 2 }
    },
    {
      "id": "block_14",
      "type": "paragraph",
      "data": {
        "text": "Pablo se llamaba Saulo, nació en Tarso de Cilicia y era un perseguidor de los discípulos del Señor. La conversión de Saulo tuvo lugar hacia el año 36 y es uno de los hechos más importantes de la iglesia primitiva. Después de su conversión comienza a predicar ante diferentes comunidades, hablaba sobre el Reino de Dios y trataba convencer a sus oyentes."
      }
    },
    {
      "id": "block_15",
      "type": "paragraph",
      "data": {
        "text": "Un modo de predicar fue a través de las diferentes \"cartas\" que envió a varias poblaciones. Las cartas paulinas tienen el valor de un testimonio inmediato sobre la vida, las dificultades y el crecimiento de las comunidades cristianas en el mundo pagano. Pablo arroja en cada página una nueva luz sobre el misterio de Cristo o de la iglesia."
      }
    }
  ]
}
```

---

### 2. INSTITUCIONAL - Autoridades (slug: "autoridades")

**Contenido**:

```json
{
  "blocks": [
    {
      "id": "block_1",
      "type": "heading",
      "data": { "text": "Equipo Directivo", "level": 2 }
    },
    {
      "id": "block_2",
      "type": "paragraph",
      "data": { "text": "PÁRROCO: Pbro Ladrón de Guevara, Javier" }
    },
    {
      "id": "block_3",
      "type": "paragraph",
      "data": { "text": "REPRESENTANTE LEGAL: Rodríguez, Luis A." }
    },
    {
      "id": "block_4",
      "type": "paragraph",
      "data": { "text": "DIRECTORA GENERAL: Molina, Silvia" }
    },
    {
      "id": "block_5",
      "type": "heading",
      "data": { "text": "Nivel Inicial", "level": 3 }
    },
    {
      "id": "block_6",
      "type": "paragraph",
      "data": { "text": "DIRECTORA: Barbatti, Claudia" }
    },
    {
      "id": "block_7",
      "type": "heading",
      "data": { "text": "Nivel Primario", "level": 3 }
    },
    {
      "id": "block_8",
      "type": "paragraph",
      "data": { "text": "DIRECTORA: Slanc, Andrea" }
    },
    {
      "id": "block_9",
      "type": "paragraph",
      "data": { "text": "VICE-DIRECTORA: Guiguet, Verónica" }
    },
    {
      "id": "block_10",
      "type": "paragraph",
      "data": { "text": "VICE-DIRECTORA: Rauch, Marcela" }
    },
    {
      "id": "block_11",
      "type": "heading",
      "data": { "text": "Nivel Secundario", "level": 3 }
    },
    {
      "id": "block_12",
      "type": "paragraph",
      "data": { "text": "DIRECTOR: Frías, Fernando" }
    },
    {
      "id": "block_13",
      "type": "paragraph",
      "data": { "text": "VICEDIRECTOR: Jauregui, Alejandro" }
    }
  ]
}
```

---

### 3. NIVELES - Inicial (slug: "nivel-inicial")

**Contenido**:

```json
{
  "blocks": [
    {
      "id": "block_1",
      "type": "heading",
      "data": { "text": "Propuesta Educativa", "level": 2 }
    },
    {
      "id": "block_2",
      "type": "paragraph",
      "data": {
        "text": "El Nivel Inicial tiene por intención brindarles aprendizajes significativos para que los niños puedan desenvolverse en su entorno, ver lo conocido con otros ojos, brindándoles oportunidades para que ellos mismos busquen respuestas que les permita comprender el mundo que los rodea."
      }
    },
    {
      "id": "block_3",
      "type": "paragraph",
      "data": {
        "text": "Para el cumplimiento de esta función se atenderá a la formación de competencias referidas al área de lengua oral y escritura en el contexto escolar y coloquial."
      }
    },
    {
      "id": "block_4",
      "type": "paragraph",
      "data": {
        "text": "En el área de matemática se desarrollarán situaciones de aprendizajes que conlleven a la construcción de conceptos básicos sobre números, espacio y medida vinculados a esos usos y funciones."
      }
    },
    {
      "id": "block_5",
      "type": "paragraph",
      "data": {
        "text": "En el área de Ciencias Sociales y Naturales como también en Tecnología se propiciará un acercamiento al conocimiento del ambiente social y natural descubriendo sus transformaciones."
      }
    },
    {
      "id": "block_6",
      "type": "heading",
      "data": { "text": "Objetivos del Nivel Inicial", "level": 2 }
    },
    {
      "id": "block_7",
      "type": "list",
      "data": {
        "style": "unordered",
        "items": [
          "Promover el aprendizaje y desarrollo de los alumnos como personas sujetos de derechos y partícipes activos de un proceso de formación integral.",
          "Respetar la diversidad promoviendo procesos de integración socio-educativas.",
          "Promover en los alumnos los valores paulinos y éticos de solidaridad, responsabilidad, amistad, cooperación y respeto.",
          "Fortalecer el vínculo entre la familia y la institución a fin de compartir pautas y criterios.",
          "Promover la elaboración de proyectos integradores entre el nivel inicial y el nivel primario.",
          "Desarrollar acciones tendientes a mejorar la comunicación y los vínculos entre la comunidad educativa."
        ]
      }
    }
  ]
}
```

---

### 4. NIVELES - Primario (slug: "nivel-primario")

**Imágenes**: Carpeta `public/imagenes/niveles-primario/` (subir a galería después)

**Contenido**:

```json
{
  "blocks": [
    {
      "id": "block_1",
      "type": "heading",
      "data": { "text": "Propuesta Educativa", "level": 2 }
    },
    {
      "id": "block_2",
      "type": "paragraph",
      "data": {
        "text": "La propuesta educativa del nivel primario se centra en el abordaje de proyectos educativos que fomenten y alienten a trabajar día a día el ser ciudadanos comprometidos y responsables, resaltando los valores de la solidaridad, el respeto y amor al prójimo, la búsqueda del bien común, el trabajo colaborativo; como valores que construyen el ser personas desde una pedagogía paulina."
      }
    },
    {
      "id": "block_3",
      "type": "paragraph",
      "data": {
        "text": "Nuestra Escuela ofrece tres (3) divisiones de 1º a 6º grado en el Turno Mañana. El horario es de 8:00 hs a 12:20 hs."
      }
    }
  ]
}
```

---

### 5. NIVELES - Secundario (slug: "nivel-secundario")

**Imágenes**: Carpeta `public/imagenes/niveles-secundario/` (subir a galería después)

**Contenido**: (Usar el mismo que Primario por ahora, está mal en el documento - dice "Primario" en la sección de Secundario)

---

### 6. BECAS (slug: "becas")

**Contenido**:

```json
{
  "blocks": [
    {
      "id": "block_1",
      "type": "heading",
      "data": { "text": "Reglamento de Becas", "level": 2 }
    },
    {
      "id": "block_2",
      "type": "paragraph",
      "data": {
        "text": "ARTÍCULO 1°: El Régimen de otorgamiento de Becas para Alumnos del Escuela Parroquial San Pablo Apóstol tiene por finalidad facilitar y estimular la realización de los estudios de Nivel Inicial, Primario y Secundario que se dictan en su seno, y su funcionamiento tendrá especialmente en cuenta los objetivos de calidad, equidad y transparencia."
      }
    },
    {
      "id": "block_3",
      "type": "paragraph",
      "data": {
        "text": "ARTÍCULO 2°: Las Becas son únicas y exclusivamente de ayuda social económica (aplicable a cualquiera de los tres niveles)."
      }
    },
    {
      "id": "block_4",
      "type": "paragraph",
      "data": {
        "text": "ARTÍCULO 3°: Las Becas estarán destinadas a facilitar la prosecución de los estudios, en cualquiera de los niveles a alumnos que acrediten de modo fehaciente, y previa visita de una Trabajadora Social que envíe el Instituto, una situación económica permanente o circunstancial que le impida realizar estudios en la Escuela Parroquial San Pablo Apóstol."
      }
    },
    {
      "id": "block_5",
      "type": "paragraph",
      "data": {
        "text": "ARTÍCULO 4°: Para acceder a la solicitud de las Becas, las familias NO DEBERÁN POSEER DEUDAS con la ESCUELA PARROQUIAL SAN PABLO APÓSTOL al momento de la solicitud, SIN EXCEPCION, y el alumno deberá tener por lo menos un año de cursado en el mismo, como mínimo."
      }
    },
    {
      "id": "block_6",
      "type": "heading",
      "data": { "text": "Requisitos para Becas", "level": 2 }
    },
    {
      "id": "block_7",
      "type": "paragraph",
      "data": {
        "text": "Documentación a presentar para la valoración socio-económica de las familias que solicitan becas:"
      }
    },
    {
      "id": "block_8",
      "type": "list",
      "data": {
        "style": "ordered",
        "items": [
          "Presentar una nota dirigida al Representante Legal, expresando los motivos por los que solicita ayuda a través del sistema de Beca.",
          "Fotocopias de DNI del padre y madre o tutores.",
          "Si es empleado en relación de dependencia: Fotocopia del último recibo de sueldo de los padres y demás integrantes de la familia conviviente.",
          "Trabajadores independientes: Fotocopia de pago del mes de octubre del corriente año en AFIP y fotocopia de credencial de pago.",
          "En caso de jubilados y/o pensionados: Fotocopia de recibo de cobro del mes de octubre del corriente año.",
          "En caso de estar desocupado presentar Negativa de ANSES de los padres o tutores.",
          "Otros ingresos: comprobante de cuota alimentaria y asignación universal por hijo.",
          "Fotocopia del pago de los servicios del mes de Setiembre y Octubre.",
          "Fotocopia del último pago de las tarjetas de crédito.",
          "En relación a la vivienda: si es alquilada, recibo de alquiler; si se está pagando crédito, cuota mensual.",
          "Otra documentación relevante: medicina prepaga, actividad deportiva, cultural, idiomas, etc.",
          "Presentar la Declaración Jurada de solicitud de beca."
        ]
      }
    },
    {
      "id": "block_9",
      "type": "paragraph",
      "data": {
        "text": "Se deja aclarado que el solicitante deberá presentar cada una de la documentación que se le requiere para cada caso, y si la presentación estuviera incompleta, no se otorgará la ayuda."
      }
    }
  ]
}
```

---

### 7. PASANTÍAS - Objetivo (slug: "pasantias-objetivo")

**Imágenes**: Carpeta `public/imagenes/pasantias-lugares/` (subir a galería después)

**Contenido**:

```json
{
  "blocks": [
    {
      "id": "block_1",
      "type": "heading",
      "data": { "text": "Fundamentación", "level": 2 }
    },
    {
      "id": "block_2",
      "type": "paragraph",
      "data": {
        "text": "Partiendo del objetivo fundamental que persigue el espacio curricular de Formación para la vida y el Trabajo que es orientar a los estudiantes en la progresiva construcción de su proyecto de vida en los ámbitos personal y social, y teniendo en cuenta el objetivo específico de sexto año que consiste en realizar prácticas vinculadas a la continuidad de los estudios y al mundo del trabajo; se enmarca la puesta en práctica de las pasantías educativas."
      }
    },
    {
      "id": "block_3",
      "type": "paragraph",
      "data": {
        "text": "Las mismas son una herramienta pedagógica de suma importancia para facilitar, en nuestros jóvenes, la adquisición de las competencias que se solicitan en nuestro contexto social a la hora de formar parte en el mundo laboral."
      }
    },
    {
      "id": "block_4",
      "type": "heading",
      "data": { "text": "Objetivo General", "level": 2 }
    },
    {
      "id": "block_5",
      "type": "paragraph",
      "data": {
        "text": "Insertar a los alumnos a una experiencia laboral concreta, a fin de que puedan integrar los saberes escolares con los brindados en el ámbito que realizan la experiencia y fortalecer, de este modo, las competencias necesarias para acceder y permanecer en el mundo laboral."
      }
    },
    {
      "id": "block_6",
      "type": "heading",
      "data": { "text": "Objetivos Específicos", "level": 2 }
    },
    {
      "id": "block_7",
      "type": "list",
      "data": {
        "style": "unordered",
        "items": [
          "Que los jóvenes conozcan y pongan en prácticas las competencias básicas requeridas en el contexto socio productivo actual.",
          "Generar en los pasantes una actitud de disposición y aprendizaje continua ante los requerimientos de la experiencia laboral.",
          "Que los pasantes puedan ejercitar competencias básicas e instrumentales en el lugar de la experiencia laboral.",
          "Que los alumnos puedan relacionar sus potencialidades personales con las oportunidades laborales."
        ]
      }
    },
    {
      "id": "block_8",
      "type": "heading",
      "data": { "text": "Lugares de Pasantías", "level": 2 }
    },
    {
      "id": "block_9",
      "type": "paragraph",
      "data": {
        "text": "Tarjeta Naranja: Tareas de tipo administrativo en el sector de baja de la tarjeta y en la recepción. Duración de cuatro semanas, cuatro horas diarias."
      }
    },
    {
      "id": "block_10",
      "type": "paragraph",
      "data": {
        "text": "Banco Macro: Tareas de tipo administrativo y financiera. El banco evalúa el sector según el perfil del pasante. Duración de un mes de lunes a viernes en horario bancario."
      }
    },
    {
      "id": "block_11",
      "type": "paragraph",
      "data": {
        "text": "JAEC: Tareas administrativa de organización, clasificación y sistematización de información en formato digital."
      }
    }
  ]
}
```

---

### 8. PASTORAL - Info General (slug: "pastoral-info")

**Imágenes**: Carpeta `public/imagenes/pastor-infogeneral/` (MUCHAS fotos - subir solo las mejores a galería)

**Contenido**:

```json
{
  "blocks": [
    {
      "id": "block_1",
      "type": "heading",
      "data": { "text": "Fundamentación", "level": 2 }
    },
    {
      "id": "block_2",
      "type": "paragraph",
      "data": {
        "text": "Como comunidad educativa buscamos \"Promover, como Comunidad Educativa, la formación integral de cada alumno/a, como persona consciente, libre, responsable y abierta a la verdad, a través de una Pedagogía Cristocéntrica y de Mística Paulina; que tienda al logro de la síntesis FE, CULTURA Y VIDA, y lo haga capaz de participar activamente, humanizando y cristianizando la sociedad en la que vive.\""
      }
    },
    {
      "id": "block_3",
      "type": "paragraph",
      "data": {
        "text": "Entendemos la escuela como un espacio social que tiene como función asegurar la comunicación y transmisión cultural. Este encuentro generacional se da en torno al saber conocer, saber hacer, saber ser y saber vivir juntos."
      }
    },
    {
      "id": "block_4",
      "type": "paragraph",
      "data": {
        "text": "Si hablamos de escuela con inspiración cristiana, nos referimos a aquella institución educativa que tiene a Jesucristo como clave de resignificación de los saberes, de orientación de la acción y de la apertura a una esperanza trascendente."
      }
    },
    {
      "id": "block_5",
      "type": "heading",
      "data": { "text": "Actividades Pastorales", "level": 2 }
    },
    {
      "id": "block_6",
      "type": "paragraph",
      "data": {
        "text": "Se realizan convivencias por cursos, espacios valiosos donde los estudiantes pueden encontrarse consigo mismo y entre sí de una manera diversa a las dinámicas planteadas por el ritmo escolar. Es un momento pensado para poder acrecentar y puntualizar el trabajo educativo-pastoral."
      }
    },
    {
      "id": "block_7",
      "type": "paragraph",
      "data": {
        "text": "Por esto se propone trabajar en una jornada temas que responda a la realidad del curso habiendo previamente realizado el diagnóstico del grupo. Consideramos de suma importancia la realización de estas convivencias que complementan e incentivan el proceso de maduración de los estudiantes."
      }
    }
  ]
}
```

---

## 🖼️ IMÁGENES ESPECIALES

### Logo del colegio
**Archivo**: `public/imagenes/logo.png`
**Uso**: Navbar, Footer, configuración del sitio

### Hero images para homepage
**Archivos**:
- `public/imagenes/hero1.jpg`
- `public/imagenes/hero2.jpg`
- `public/imagenes/hero3.jpg`

**Uso**: Subir a Cloudinary y configurar en SiteConfig (por ahora usar solo hero1.jpg)

---

## 📸 GALERÍA DE IMÁGENES

Subir estas carpetas completas al ABM de galería (`/admin/galeria`):

1. **Carpeta**: `public/imagenes/institucional-galeria/`
   - Título sugerido: "Institucional"
   - Descripción: "Instalaciones del colegio"

2. **Carpeta**: `public/imagenes/niveles-primario/`
   - Título sugerido: "Nivel Primario"
   - Descripción: "Actividades y alumnos del nivel primario"

3. **Carpeta**: `public/imagenes/niveles-secundario/`
   - Título sugerido: "Nivel Secundario"
   - Descripción: "Actividades y alumnos del nivel secundario"

4. **Carpeta**: `public/imagenes/pasantias-lugares/`
   - Título sugerido: "Pasantías"
   - Descripción: "Alumnos en experiencias laborales"

5. **Carpeta**: `public/imagenes/pastor-infogeneral/`
   - Título sugerido: "Pastoral"
   - Descripción: "Actividades pastorales y convivencias"
   - **NOTA**: Son MUCHAS fotos, subir solo las mejores (10-15 máximo)

---

## 📋 INSTRUCCIONES DE EJECUCIÓN

### Opción A: Script de migración automático

Crear un script `prisma/migrate-content.ts` que:

1. Lea este spec
2. Actualice SiteConfig
3. Actualice cada Section con su contenido en formato JSON
4. Ejecute con `npx ts-node prisma/migrate-content.ts`

### Opción B: Seed actualizado

Actualizar `prisma/seed.ts` para que en vez de contenido placeholder use todo el contenido real de este spec.

### Opción C: Manual desde admin

Copiar y pegar el contenido JSON de cada sección directamente en el editor del admin (más lento pero más seguro para probar).

---

## ✅ CHECKLIST DE MIGRACIÓN

- [ ] Actualizar SiteConfig con datos reales
- [ ] Actualizar sección "nuestra-escuela" con contenido completo
- [ ] Actualizar sección "autoridades" con nombres reales
- [ ] Actualizar sección "nivel-inicial" con propuesta educativa
- [ ] Actualizar sección "nivel-primario" con propuesta y horarios
- [ ] Actualizar sección "nivel-secundario" (pendiente contenido específico)
- [ ] Actualizar sección "becas" con reglamento completo
- [ ] Actualizar sección "pasantias-objetivo" con fundamentación y lugares
- [ ] Actualizar sección "pastoral-info" con fundamentación y actividades
- [ ] Subir logo.png a `/public/images/logo.png`
- [ ] Subir hero1.jpg a Cloudinary y configurar en SiteConfig
- [ ] Subir imágenes de galería por carpetas (institucional, niveles, pasantías, pastoral)
- [ ] Actualizar Navbar para usar logo.png
- [ ] Testing de todas las páginas con contenido real

---

**Tiempo estimado**: 1-2 horas si se hace con script automatizado, 3-4 horas si se carga manualmente desde el admin.

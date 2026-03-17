import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ipsanpablo.com' },
    update: {},
    create: {
      email: 'admin@ipsanpablo.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  })
  console.log('Created admin user:', admin.email)

  // Site config
  await prisma.siteConfig.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      schoolName: 'Instituto Parroquial San Pablo Apóstol',
      phone: '(0351) 000-0000',
      email: 'secretaria@ipsanpablo.com',
      address: 'Asturias 1935, Barrio Colón, Córdoba',
      heroTitle: 'Instituto Parroquial San Pablo Apóstol',
      heroSubtitle: 'Educación con valores desde 1959',
      inscripcionOpen: false,
      inscripcionText: 'Las inscripciones para el ciclo lectivo están abiertas.',
    },
  })
  console.log('Created site config')

  // Sections with real content
  const sections = [
    // ─── INSTITUCIONAL ───────────────────────────────────────────────────────
    {
      slug: 'nuestra-escuela',
      title: 'Nuestra Escuela',
      pageGroup: 'institucional',
      sortOrder: 1,
      content: JSON.stringify({
        blocks: [
          { id: 'ne1', type: 'heading', data: { text: 'Objetivo Institucional', level: 2 } },
          { id: 'ne2', type: 'paragraph', data: { text: 'Promover como Comunidad Educativa la formación integral de cada alumno y alumna como persona consciente, libre, responsable y abierta a la verdad a través de una Pedagogía Cristocéntrica y de una Mística Paulina que atienda al logro de la síntesis FE, CULTURA y VIDA, y lo haga capaz de participar activamente, humanizando y cristianizando la sociedad en la que vive.' } },
          { id: 'ne3', type: 'heading', data: { text: 'Persona', level: 2 } },
          { id: 'ne4', type: 'paragraph', data: { text: 'Creada a la imagen de Dios, el ser humano tiene la dignidad de persona. Es alguien capaz de conocerse, de poseerse, de darse libremente y entrar en comunión con otras personas; y es llamado, por la gracia a una alianza con el Creador, a ofrecerle una respuesta de fe y amor.' } },
          { id: 'ne5', type: 'heading', data: { text: 'Educación', level: 2 } },
          { id: 'ne6', type: 'paragraph', data: { text: 'El objetivo de la educación es el de humanizar y personalizar al hombre, orientándolo eficazmente hacia su fin último que trasciende de la finitud esencial del hombre. La educación ha de ser personalista, personalizada y personalizante. La Escuela Católica tiene por fin la comunicación sistemática y crítica de la cultura, para la formación integral de la persona. Persigue este fin dentro de una visión humanista de la realidad, tendiendo a formar al Cristiano en las virtudes que lo configuran con Cristo, su modelo y le permiten colaborar en la edificación del Reino.' } },
          { id: 'ne7', type: 'heading', data: { text: 'Estilo de Enseñanza y Aprendizaje', level: 2 } },
          { id: 'ne8', type: 'paragraph', data: { text: 'Entendemos el estilo de enseñanza y aprendizaje como la formalización de la manera de enseñar y aprender en la escuela. Los rasgos de la Pedagogía Paulina que sostienen nuestro estilo de enseñanza y aprendizaje son:' } },
          { id: 'ne9', type: 'list', data: { style: 'unordered', items: [
            'La centralidad del alumno y alumna, meta, sentido y base de la propuesta educativa.',
            'La personalización, en tanto está dirigida a entender a la particular idiosincrasia de cada persona en su realidad única e irrepetible.',
            'Los contenidos evangelizados y evangelizadores, en orden a la relación entre la cultura, la fe y la vida.',
            'La educación significativa, orientando los contenidos, los saberes, los procedimientos, los valores y principios, a la propia existencia de los educandos.',
            'Los valores cristianos como principios reguladores del proceso educativo son orientadores de la tarea educativa.',
            'El proceso escolar inscripto dentro de la formación permanente de las personas.',
            'La comunidad educativa en tanto educadora, desde contenidos, modos, procedimientos y valores que transmite, tanto a nivel áulico, como extra-áulico.',
          ] } },
          { id: 'ne10', type: 'heading', data: { text: 'Comunidad Educativa', level: 2 } },
          { id: 'ne11', type: 'paragraph', data: { text: 'Se define por el reconocimiento y valoración de cada uno de sus miembros: alumnos, docentes y no docentes, directivos, padres y madres, personal administrativo, de limpieza, de seguridad y mantenimiento, quienes participan de un modo específico y particular de la misión y objetivos institucionales.' } },
          { id: 'ne12', type: 'heading', data: { text: 'Nuestro Patrono', level: 2 } },
          { id: 'ne12b', type: 'image', data: { url: '', alt: 'San Pablo Apóstol', caption: 'San Pablo Apóstol', size: 'small' } },
          { id: 'ne13', type: 'paragraph', data: { text: 'Pablo se llamaba Saulo, nació en Tarso de Cilicia y era un perseguidor de los discípulos del Señor. La conversión de Saulo tuvo lugar hacia el año 36 y es uno de los hechos más importantes de la iglesia primitiva. Después de su conversión comienza a predicar ante diferentes comunidades, hablaba sobre el Reino de Dios y trataba de convencer a sus oyentes.' } },
          { id: 'ne14', type: 'paragraph', data: { text: 'Un modo de predicar fue a través de las diferentes cartas que envió a varias poblaciones, ya que era imposible su presencia en todas ellas. Algunas estaban dirigidas a comunidades como Efesios y Romanos, o a sus autoridades, otras a una persona determinada. Las cartas trataban temas de interés para toda la comunidad y pocas veces tenían un carácter íntimo o familiar.' } },
          { id: 'ne15', type: 'paragraph', data: { text: 'Las cartas paulinas tienen el valor de un testimonio inmediato sobre la vida, las dificultades y el crecimiento de las comunidades cristianas en el mundo pagano. En ellas se encuentra vivamente reflejada la personalidad de Pablo: su fe ardiente, su rica sensibilidad, su temperamento apasionado, su voluntad y especialmente su condición de APÓSTOL. Pablo arroja en cada página una nueva luz sobre el misterio de Cristo o de la iglesia.' } },
        ],
      }),
    },
    {
      slug: 'autoridades',
      title: 'Autoridades',
      pageGroup: 'institucional',
      sortOrder: 2,
      content: JSON.stringify({
        blocks: [
          { id: 'au1', type: 'heading', data: { text: 'Equipo Directivo', level: 2 } },
          { id: 'au2', type: 'paragraph', data: { text: 'PÁRROCO: Pbro. Ladrón de Guevara, Javier' } },
          { id: 'au3', type: 'paragraph', data: { text: 'REPRESENTANTE LEGAL: Rodríguez, Luis A.' } },
          { id: 'au4', type: 'paragraph', data: { text: 'DIRECTORA GENERAL: Molina, Silvia' } },
          { id: 'au5', type: 'heading', data: { text: 'Nivel Inicial', level: 3 } },
          { id: 'au6', type: 'paragraph', data: { text: 'DIRECTORA: Barbatti, Claudia' } },
          { id: 'au7', type: 'heading', data: { text: 'Nivel Primario', level: 3 } },
          { id: 'au8', type: 'list', data: { style: 'unordered', items: [
            'DIRECTORA: Slanc, Andrea',
            'VICE-DIRECTORA: Guiguet, Verónica',
            'VICE-DIRECTORA: Rauch, Marcela',
          ] } },
          { id: 'au9', type: 'heading', data: { text: 'Nivel Secundario', level: 3 } },
          { id: 'au10', type: 'list', data: { style: 'unordered', items: [
            'DIRECTOR: Frías, Fernando',
            'VICEDIRECTOR: Jauregui, Alejandro',
          ] } },
        ],
      }),
    },
    {
      slug: 'galeria-institucional',
      title: 'Galería Institucional',
      pageGroup: 'institucional',
      sortOrder: 3,
      content: JSON.stringify({
        blocks: [
          { id: 'gi1', type: 'paragraph', data: { text: 'Imágenes de nuestra institución. Las fotografías se administran desde el panel de administración.' } },
        ],
      }),
    },

    // ─── NIVELES ─────────────────────────────────────────────────────────────
    {
      slug: 'nivel-inicial',
      title: 'Nivel Inicial',
      pageGroup: 'niveles',
      sortOrder: 1,
      content: JSON.stringify({
        blocks: [
          { id: 'ni1', type: 'heading', data: { text: 'Propuesta Educativa', level: 2 } },
          { id: 'ni2', type: 'paragraph', data: { text: 'El Nivel Inicial tiene por intención brindarles aprendizajes significativos para que los niños puedan desenvolverse en su entorno, ver lo conocido con otros ojos, brindándoles oportunidades para que ellos mismos busquen respuestas que les permita comprender el mundo que los rodea.' } },
          { id: 'ni3', type: 'paragraph', data: { text: 'Para el cumplimiento de esta función se atenderá a la formación de competencias referidas al área de lengua oral y escritura en el contexto escolar y coloquial.' } },
          { id: 'ni4', type: 'paragraph', data: { text: 'En el área de matemática se desarrollarán situaciones de aprendizajes que conlleven a la construcción de conceptos básicos sobre números, espacio y medida vinculados a esos usos y funciones, generando competencias para el establecimiento de relaciones y representaciones gráficas y a su comunicación oral y escrita.' } },
          { id: 'ni5', type: 'paragraph', data: { text: 'En el área de Ciencias Sociales y Naturales como también en Tecnología se propiciará un acercamiento al conocimiento del ambiente social y natural descubriendo sus transformaciones, permitiendo organizar la realidad en forma inmediata. Por último en el área de expresión artística se apuntará a la construcción para que puedan explotar creativamente formas de expresión y comunicación.' } },
          { id: 'ni6', type: 'paragraph', data: { text: 'Cabe destacar que la familia es el principal agente educativo con valores y normas éticas que respetan la libertad de cada familia.' } },
          { id: 'ni7', type: 'heading', data: { text: 'Objetivos del Nivel Inicial', level: 2 } },
          { id: 'ni8', type: 'list', data: { style: 'unordered', items: [
            'Promover el aprendizaje y desarrollo de los alumnos como personas sujetos de derechos y partícipes activos de un proceso de formación integral, miembros de una familia y una comunidad.',
            'Respetar la diversidad promoviendo procesos de integración socio-educativas.',
            'Promover en los alumnos los valores paulinos y éticos de solidaridad, responsabilidad, amistad, cooperación y respeto por sí mismo y por los demás.',
            'Fortalecer el vínculo entre la familia y la institución a fin de compartir pautas y criterios en relación con la formación de los alumnos.',
            'Promover la elaboración de proyectos integradores entre el nivel inicial y el nivel primario que favorezcan la articulación.',
            'Desarrollar acciones tendientes a mejorar la comunicación y los vínculos entre la comunidad educativa y las demás escuelas de la zona.',
          ] } },
        ],
      }),
    },
    {
      slug: 'nivel-primario',
      title: 'Nivel Primario',
      pageGroup: 'niveles',
      sortOrder: 2,
      content: JSON.stringify({
        blocks: [
          { id: 'np1', type: 'heading', data: { text: 'Propuesta Educativa', level: 2 } },
          { id: 'np2', type: 'paragraph', data: { text: 'La propuesta educativa del nivel primario se centra en el abordaje de proyectos educativos que fomenten y alienten a trabajar día a día el ser ciudadanos comprometidos y responsables, resaltando los valores de la solidaridad, el respeto y amor al prójimo, la búsqueda del bien común, el trabajo colaborativo; como valores que construyen el ser personas desde una pedagogía paulina.' } },
          { id: 'np3', type: 'paragraph', data: { text: 'Nuestra Escuela ofrece tres (3) divisiones de 1º a 6º grado en el Turno Mañana. El horario es de 8:00 hs a 12:20 hs.' } },
        ],
      }),
    },
    {
      slug: 'nivel-secundario',
      title: 'Nivel Secundario',
      pageGroup: 'niveles',
      sortOrder: 3,
      content: JSON.stringify({
        blocks: [
          { id: 'ns1', type: 'heading', data: { text: 'Propuesta Educativa', level: 2 } },
          { id: 'ns2', type: 'paragraph', data: { text: 'El contenido específico del Nivel Secundario será completado próximamente con la información actualizada del ciclo lectivo vigente.' } },
        ],
      }),
    },

    // ─── BECAS ───────────────────────────────────────────────────────────────
    {
      slug: 'becas',
      title: 'Becas',
      pageGroup: 'becas',
      sortOrder: 1,
      content: JSON.stringify({
        blocks: [
          { id: 'be1', type: 'heading', data: { text: 'Reglamento de Becas', level: 2 } },
          { id: 'be2', type: 'paragraph', data: { text: 'ARTÍCULO 1°: El Régimen de otorgamiento de Becas para Alumnos del Escuela Parroquial San Pablo Apóstol tiene por finalidad facilitar y estimular la realización de los estudios de Nivel Inicial, Primario y Secundario que se dictan en su seno, y su funcionamiento tendrá especialmente en cuenta los objetivos de calidad, equidad y transparencia.' } },
          { id: 'be3', type: 'paragraph', data: { text: 'ARTÍCULO 2°: Las Becas son únicas y exclusivamente de ayuda social económica (aplicable a cualquiera de los tres niveles).' } },
          { id: 'be4', type: 'paragraph', data: { text: 'ARTÍCULO 3°: Las Becas estarán destinadas a facilitar la prosecución de los estudios, en cualquiera de los niveles a alumnos que acrediten de modo fehaciente, y previa visita de una Trabajadora Social que envíe el Instituto, una situación económica permanente o circunstancial que le impida realizar estudios en la Escuela Parroquial San Pablo Apóstol, y siempre que ésta dificultad persista durante el transcurso del año lectivo.' } },
          { id: 'be5', type: 'paragraph', data: { text: 'ARTÍCULO 4°: Para acceder a la solicitud de las Becas, las familias NO DEBERÁN POSEER DEUDAS con la ESCUELA PARROQUIAL SAN PABLO APÓSTOL al momento de la solicitud, SIN EXCEPCIÓN, y el alumno deberá tener por lo menos un año de cursado en el mismo, como mínimo.' } },
          { id: 'be6', type: 'paragraph', data: { text: 'ARTÍCULO 5°: Cada familia podrá requerir y presentar solamente 1 (una) solicitud de Becas.' } },
          { id: 'be7', type: 'paragraph', data: { text: 'ARTÍCULO 6°: El número de Becas a otorgar no excederá al 10% del total de alumnos inscriptos, proporcional al número de cada nivel.' } },
          { id: 'be8', type: 'paragraph', data: { text: 'ARTÍCULO 7°: Las Becas asignadas son intransferibles a otro alumno del establecimiento.' } },
          { id: 'be9', type: 'paragraph', data: { text: 'ARTÍCULO 8°: Las Becas para alumnos consistirán en la eximición parcial de los aranceles que la Escuela establezca.' } },
          { id: 'be10', type: 'heading', data: { text: 'De las condiciones para ser beneficiario', level: 2 } },
          { id: 'be11', type: 'paragraph', data: { text: 'ARTÍCULO 9°: Para aspirar a las Becas el alumno deberá:' } },
          { id: 'be12', type: 'list', data: { style: 'unordered', items: [
            'Retirar de Administración el formulario de solicitud de Becas, en el tiempo establecido.',
            'Aceptar la visita social de la Trabajadora Social que designe la Escuela en el domicilio denunciado.',
            'Acreditar los extremos que prevé el artículo 3 de este Régimen con la documentación requerida.',
            'Solventar los gastos por honorarios profesionales de la Trabajadora Social.',
          ] } },
          { id: 'be13', type: 'paragraph', data: { text: 'ARTÍCULO 10°: Una vez presentada la solicitud de Becas y cumpliendo con los requisitos mencionados, se dispondrá la intervención de una Trabajadora Social, quien realizará un informe técnico, previa visita social a los domicilios de los solicitantes.' } },
          { id: 'be14', type: 'paragraph', data: { text: 'ARTÍCULO 11°: Las manifestaciones de los alumnos o de sus padres o tutores relacionadas con la situación económica tendrán el carácter de declaración jurada y las falsedades que pudieren contener serán causal de extinción de las Becas y otro tipo de sanciones, incluido el derecho de admisión.' } },
          { id: 'be15', type: 'paragraph', data: { text: 'ARTÍCULO 12°: El otorgamiento y administración de la Beca estará a cargo del Consejo Directivo, presidido por el Representante Legal, e integrado por el Director General y los Equipos Directivos de cada uno de los niveles.' } },
          { id: 'be16', type: 'paragraph', data: { text: 'ARTÍCULO 14°: Las resoluciones del Consejo Directivo serán inapelables.' } },
          { id: 'be17', type: 'heading', data: { text: 'De la solicitud y renovación', level: 2 } },
          { id: 'be18', type: 'paragraph', data: { text: 'ARTÍCULO 15°: Las Becas deben solicitarse por escrito, en los plazos que el Consejo Directivo fijare cada año, acompañando la documentación que en cada caso se requiera.' } },
          { id: 'be19', type: 'paragraph', data: { text: 'ARTÍCULO 16°: Las Becas se acordarán inicialmente por el término de un año, debiendo los beneficiarios solicitar anualmente su renovación.' } },
          { id: 'be20', type: 'heading', data: { text: 'Causales de extinción', level: 2 } },
          { id: 'be21', type: 'list', data: { style: 'unordered', items: [
            'El incumplimiento de las condiciones establecidas.',
            'La falsedad en las declaraciones juradas que se presenten.',
            'El abandono de los estudios por parte del beneficiado.',
            'La finalización normal de los estudios.',
          ] } },
          { id: 'be22', type: 'heading', data: { text: 'Requisitos - Documentación a presentar', level: 2 } },
          { id: 'be23', type: 'list', data: { style: 'ordered', items: [
            'Nota dirigida al Representante Legal expresando los motivos de la solicitud.',
            'Fotocopias de DNI del padre y madre o tutores.',
            'Si es empleado en relación de dependencia: Fotocopia del último recibo de sueldo.',
            'Trabajadores independientes: Fotocopia de pago del mes de octubre en AFIP.',
            'Jubilados y/o pensionados: Fotocopia de recibo de cobro del mes de octubre.',
            'Desocupados: Negativa de ANSES de los padres o tutores.',
            'Otros ingresos: comprobante de cuota alimentaria y asignación universal por hijo.',
            'Fotocopia del pago de septiembre y octubre de servicios (agua, luz, gas, teléfono, cable, Internet, impuestos).',
            'Fotocopia del último pago de tarjetas de crédito (septiembre y octubre).',
            'Vivienda: si es alquilada, fotocopia de recibo de alquiler. Si hay crédito de vivienda, fotocopia de cuota mensual.',
            'Otra documentación relevante: medicina prepaga, actividad deportiva, cultural, idiomas.',
            'Presentar la Declaración Jurada de solicitud de beca.',
            'La presentación incompleta de documentación impedirá el otorgamiento de la ayuda.',
          ] } },
        ],
      }),
    },

    // ─── PASANTÍAS ───────────────────────────────────────────────────────────
    {
      slug: 'pasantias-objetivo',
      title: 'Pasantías - Objetivo',
      pageGroup: 'pasantias',
      sortOrder: 1,
      content: JSON.stringify({
        blocks: [
          { id: 'po1', type: 'heading', data: { text: 'Fundamentación', level: 2 } },
          { id: 'po2', type: 'paragraph', data: { text: 'Partiendo del objetivo fundamental que persigue el espacio curricular de Formación para la Vida y el Trabajo que es orientar a los estudiantes en la progresiva construcción de su proyecto de vida en los ámbitos personal y social, y teniendo en cuenta el objetivo específico de sexto año que consiste en realizar prácticas vinculadas a la continuidad de los estudios y al mundo del trabajo; se enmarca la puesta en práctica de las pasantías educativas.' } },
          { id: 'po3', type: 'paragraph', data: { text: 'Las mismas son una herramienta pedagógica de suma importancia para facilitar, en nuestros jóvenes, la adquisición de las competencias que se solicitan en nuestro contexto social a la hora de formar parte en el mundo laboral.' } },
          { id: 'po4', type: 'paragraph', data: { text: 'Consideramos de capital importancia la posibilidad del aprendizaje a través de la experiencia concreta a fin de complementar la información estudiada, debatida y reflexionada en la escuela y generar de ese modo más oportunidades para una inclusión cada vez mayor.' } },
          { id: 'po5', type: 'paragraph', data: { text: 'Las pasantías educativas constituyen prácticas concretas que permiten confrontar saberes teóricos, desarrollar conocimientos y habilidades y anticipar posibles situaciones que se les podrían presentar en el futuro, generando de esta manera aprendizajes significativos.' } },
          { id: 'po6', type: 'heading', data: { text: 'Objetivo General', level: 2 } },
          { id: 'po7', type: 'paragraph', data: { text: 'Insertar a los alumnos a una experiencia laboral concreta, a fin de que puedan integrar los saberes escolares con los brindados en el ámbito que realizan la experiencia y fortalecer, de este modo, las competencias necesarias para acceder y permanecer en el mundo laboral.' } },
          { id: 'po8', type: 'heading', data: { text: 'Objetivos Específicos', level: 2 } },
          { id: 'po9', type: 'list', data: { style: 'unordered', items: [
            'Que los jóvenes conozcan y pongan en práctica las competencias básicas requeridas en el contexto socio productivo actual.',
            'Generar en los pasantes una actitud de disposición y aprendizaje continua ante los requerimientos de la experiencia laboral.',
            'Que los pasantes puedan ejercitar competencias básicas e instrumentales en el lugar de la experiencia laboral.',
            'Que los alumnos puedan relacionar sus potencialidades personales con las oportunidades laborales.',
          ] } },
          { id: 'po10', type: 'heading', data: { text: 'Destinatarios', level: 2 } },
          { id: 'po11', type: 'paragraph', data: { text: 'El proyecto se dirige de manera directa a los alumnos que participan de la pasantía y de manera indirecta a todos los alumnos del curso al momento de socializar las experiencias, reflexionar sobre ellas y extraer los aprendizajes aportados.' } },
          { id: 'po12', type: 'paragraph', data: { text: 'También se tenderá a que genere un impacto positivo en las organizaciones, instituciones, comercios, etc. en que se lleven a cabo las pasantías, buscando aportar conocimientos, disposición, espíritu abierto al aprendizaje y colaboración.' } },
        ],
      }),
    },
    {
      slug: 'pasantias-espacios-curriculares',
      title: 'Espacios Curriculares',
      pageGroup: 'pasantias',
      sortOrder: 2,
      content: JSON.stringify({
        blocks: [
          { id: 'pe1', type: 'paragraph', data: { text: 'Conforme a la Institución en que se desarrolle la pasantía, varían los espacios correlativos intervinientes.' } },
          { id: 'pe2', type: 'heading', data: { text: 'Pasantía en Tarjeta Naranja', level: 3 } },
          { id: 'pe3', type: 'list', data: { style: 'unordered', items: [
            'Lengua y Literatura: Capacidad de expresión oral y escrita. Talleres literarios de crítica, análisis y fundamentación.',
            'Comunicación, Cultura y Sociedad: en el conocimiento del contexto social y cultural actual.',
            'Política y Ciudadanía: en la adquisición de la conciencia de involucrarse y valorar el propio aporte como profesional y ciudadano.',
          ] } },
          { id: 'pe4', type: 'heading', data: { text: 'Pasantía en Banco Macro', level: 3 } },
          { id: 'pe5', type: 'list', data: { style: 'unordered', items: [
            'Lengua y Literatura: Competencias básicas de escritura y oralidad.',
            'Materias propias de la especialidad de Economía y Gestión como Sistemas de Información Contable, Administración y Derecho.',
          ] } },
          { id: 'pe6', type: 'heading', data: { text: 'Pasantía en la JAEC', level: 3 } },
          { id: 'pe7', type: 'list', data: { style: 'unordered', items: [
            'Lengua y Literatura: competencias básicas de escritura y oralidad.',
            'Aplicación de conocimientos de cultura general para clases tutoriales de distintas áreas de conocimiento.',
          ] } },
        ],
      }),
    },
    {
      slug: 'pasantias-lugares',
      title: 'Lugares de Pasantías',
      pageGroup: 'pasantias',
      sortOrder: 3,
      content: JSON.stringify({
        blocks: [
          { id: 'pl1', type: 'heading', data: { text: 'Tarjeta Naranja', level: 3 } },
          { id: 'pl2', type: 'paragraph', data: { text: 'Tareas de tipo administrativo en el sector de baja de la tarjeta y en la recepción poniendo en práctica habilidades sociales, de manejo de TIC, de organización y planificación, compromiso, trabajo en equipo y capacidad de resolución de problemas. Duración: cuatro semanas, cuatro horas de trabajo diarias.' } },
          { id: 'pl3', type: 'heading', data: { text: 'Banco Macro', level: 3 } },
          { id: 'pl4', type: 'paragraph', data: { text: 'Tareas de tipo administrativo y financiera. El banco evalúa de acuerdo al perfil del pasante el sector más conveniente. Capacidad de búsqueda de información, clasificación, aplicación, orientación. Duración: un mes de lunes a viernes en horario bancario.' } },
          { id: 'pl5', type: 'heading', data: { text: 'JAEC', level: 3 } },
          { id: 'pl6', type: 'paragraph', data: { text: 'Tareas de tipo administrativa en organización, clasificación y sistematización de información de distintas áreas de conocimientos en formato digital para ser aplicado en las diversas escuelas que nuclean.' } },
          { id: 'pl7', type: 'divider', data: {} },
          { id: 'pl8', type: 'paragraph', data: { text: 'La participación a las pasantías se abre a todos los alumnos del curso. Se realizan con anterioridad distintas propuestas pedagógicas tendientes a trabajar su marco legal, beneficios y la importancia para la vida de esta experiencia.' } },
          { id: 'pl9', type: 'paragraph', data: { text: 'Las fechas están otorgadas por las Instituciones y en todos los casos cuentan con una charla de inducción donde quedan aclaradas las condiciones a respetar por todas las partes.' } },
          { id: 'pl_partners', type: 'partners', data: {
            heading: 'Instituciones',
            items: [
              { name: 'Banco Macro', imageUrl: '' },
              { name: 'Tarjeta Naranja', imageUrl: '' },
              { name: 'JAEC', imageUrl: '' },
              { name: 'IES Colegio Universitario', imageUrl: '' },
            ],
          } },
        ],
      }),
    },
    {
      slug: 'pasantias-monitoreo',
      title: 'Monitoreo y Evaluación',
      pageGroup: 'pasantias',
      sortOrder: 4,
      content: JSON.stringify({
        blocks: [
          { id: 'pm1', type: 'paragraph', data: { text: 'Durante la pasantía se llevará a cabo un monitoreo de la tarea desempeñada por pasantes mediante apreciaciones de tipo cualitativa descriptiva y a través de planillas semi estructuradas que posteriormente se le entregará a cada pasante a fin de que pueda autoevaluarse constructivamente.' } },
          { id: 'pm2', type: 'paragraph', data: { text: 'De igual manera luego de la experiencia cada pasante deberá elaborar un escrito con una descripción objetiva de sus tareas y una apreciación de las emociones y sensaciones generadas.' } },
          { id: 'pm3', type: 'paragraph', data: { text: 'Finalmente realizaremos con todo el grupo un foro que permitirá la socialización de todas las experiencias buscando extraer los aprendizajes incorporados, los aspectos a tener en cuenta a la hora de realizar un trabajo en relación de dependencia y la importancia de constatar lo teórico con la realidad concreta.' } },
        ],
      }),
    },

    // ─── SECRETARÍAS ─────────────────────────────────────────────────────────
    {
      slug: 'secretaria-inicial-primario',
      title: 'Secretaría - Nivel Inicial y Primario',
      pageGroup: 'secretarias',
      sortOrder: 1,
      content: JSON.stringify({
        blocks: [
          { id: 'si1', type: 'heading', data: { text: 'Horarios de Atención', level: 2 } },
          { id: 'si2', type: 'paragraph', data: { text: 'Lunes a Viernes de 8:15 a 12:00 hs.' } },
          { id: 'si3', type: 'heading', data: { text: 'Servicios que ofrecemos', level: 2 } },
          { id: 'si4', type: 'list', data: { style: 'unordered', items: [
            'Emitimos certificados escolares y constancia de alumnos regulares.',
            'Completamos formularios de escolaridad de ANSES y municipalidad.',
            'Gestionamos certificado de 6º grado de ex alumnos.',
            'Completamos formularios de boleto educativo.',
          ] } },
          { id: 'si5', type: 'heading', data: { text: 'Certificados', level: 2 } },
          { id: 'si6', type: 'paragraph', data: { text: 'Para solicitar todo tipo de certificados (Analíticos, constancia de alumnos regulares, ANSES, etc.) debe presentarse con el DNI y dirigirse a la secretaría.' } },
          { id: 'si7', type: 'heading', data: { text: 'Protocolo para Admisión', level: 2 } },
          { id: 'si8', type: 'paragraph', data: { text: 'Durante el mes de septiembre, presentar en un sobre de papel madera con el nombre del alumno candidato a ingresar el próximo año:' } },
          { id: 'si9', type: 'list', data: { style: 'unordered', items: [
            'Fotocopia del DNI del niño/a.',
            'Fotocopia del Informe de Progreso Escolar del alumno.',
            'Datos del padre/madre o tutor con teléfonos de contacto.',
          ] } },
          { id: 'si10', type: 'paragraph', data: { text: 'Los padres de los alumnos seleccionados serán entrevistados por el Departamento de Orientación Educativa (DOE) y por el Equipo Directivo del Nivel, para la admisión en los meses de octubre y noviembre. Inmediatamente concluidas las entrevistas, se deberá generar la matrícula en Administración.' } },
          { id: 'si11', type: 'heading', data: { text: 'Sala de 4 años - Inscripción de Hermanos', level: 2 } },
          { id: 'si12', type: 'list', data: { style: 'unordered', items: [
            'El período de inscripción será el que fija cada año el calendario de actividades docentes.',
            'Se convoca a pre-inscripción de hermanos de alumnos regulares.',
            'Se determinará la cantidad de vacantes disponibles.',
            'Se citará a los padres donde completarán la ficha con datos personales. La directora realizará una entrevista a los postulantes.',
            'Documentación requerida: Matrícula abonada, DNI original y copia, Ficha de Inscripción, Certificado Bucodental, ORL, Certificado de Vacunas, Certificado de Bautismo o Libreta de Familia, y CUS.',
            'Una vez presentada toda la documentación, se entrega constancia y se comunica la fecha de reunión informativa previa al inicio del ciclo escolar.',
          ] } },
          { id: 'si13', type: 'heading', data: { text: 'Hijos de ex-alumnos y lista de espera', level: 2 } },
          { id: 'si14', type: 'paragraph', data: { text: 'Se procede a determinar las vacantes disponibles posterior a la inscripción de hermanos. Se cita en primer lugar a hijos de ex-alumnos y luego a los que se encuentran en lista de espera, con la misma modalidad sumando la intervención del DOE.' } },
        ],
      }),
    },
    {
      slug: 'secretaria-secundario',
      title: 'Secretaría - Nivel Secundario',
      pageGroup: 'secretarias',
      sortOrder: 2,
      content: JSON.stringify({
        blocks: [
          { id: 'ss1', type: 'heading', data: { text: 'Horarios de Atención', level: 2 } },
          { id: 'ss2', type: 'paragraph', data: { text: 'Lunes a Viernes de 8:00 a 15:00 hs.' } },
          { id: 'ss3', type: 'heading', data: { text: 'Servicios que ofrecemos', level: 2 } },
          { id: 'ss4', type: 'list', data: { style: 'unordered', items: [
            'Emitimos certificados escolares y constancia de alumnos.',
            'Completamos formularios de escolaridad de ANSES y municipalidad.',
            'Confeccionamos y gestionamos certificados analíticos de egresados.',
            'Completamos formularios de boleto educativo.',
            'Confeccionamos mesas de exámenes con sus respectivas fechas.',
            'Otorgamos permisos de exámenes.',
            'Llevamos legajo de cada alumno.',
            'Confeccionamos planillas de estadística.',
            'Asistimos a reuniones de profesores y redactamos las actas respectivas.',
            'Custodiamos el archivo de documentos pertenecientes al establecimiento.',
          ] } },
          { id: 'ss5', type: 'heading', data: { text: 'Protocolo para Admisión', level: 2 } },
          { id: 'ss6', type: 'paragraph', data: { text: 'Durante el mes de septiembre, presentar en un sobre de papel madera con el nombre del alumno candidato:' } },
          { id: 'ss7', type: 'list', data: { style: 'unordered', items: [
            'Fotocopia del DNI del postulante.',
            'Fotocopia del Informe de últimas tres libretas del alumno/a.',
            'Datos del padre/madre o tutor con teléfonos de contacto.',
            'Certificado de buena conducta de la institución de la cual procede.',
          ] } },
          { id: 'ss8', type: 'paragraph', data: { text: 'Los padres de los alumnos seleccionados serán entrevistados por el DOE y por el Equipo Directivo del Nivel Medio para la admisión de los postulantes.' } },
        ],
      }),
    },

    // ─── ADMINISTRACIÓN ──────────────────────────────────────────────────────
    {
      slug: 'administracion',
      title: 'Administración',
      pageGroup: 'administracion',
      sortOrder: 1,
      content: JSON.stringify({
        blocks: [
          { id: 'ad1', type: 'heading', data: { text: 'Horarios de Atención', level: 2 } },
          { id: 'ad2', type: 'paragraph', data: { text: 'Lunes a Viernes de 8:15 a 12:30 hs.' } },
          { id: 'ad3', type: 'heading', data: { text: 'Novedades sobre los Aranceles', level: 2 } },
          { id: 'ad4', type: 'list', data: { style: 'unordered', items: [
            'Las cuotas serán entregadas a los alumnos de cada Nivel (Inicial, Primario y Secundario).',
            'En Inicial y Primario se pegan en el cuaderno de comunicados; en Secundario se entregan a los alumnos.',
            'Los aranceles pueden imprimirse a través de la plataforma Áulica, siempre que no estén vencidos.',
            'Las cuotas vencidas se actualizan únicamente en la administración del Instituto.',
          ] } },
          { id: 'ad5', type: 'heading', data: { text: 'Medios de Pago', level: 2 } },
          { id: 'ad6', type: 'paragraph', data: { text: 'Primer vencimiento: día 15 de cada mes. Segundo vencimiento: día 30 (excepto marzo y diciembre). Abonando hasta el primer vencimiento se obtiene una bonificación anual. Después del segundo vencimiento se aplican intereses.' } },
          { id: 'ad7', type: 'list', data: { style: 'unordered', items: [
            'PAGO FÁCIL: en cualquier sucursal del país.',
            'DÉBITO AUTOMÁTICO: con Tarjeta de Crédito y/o Débito Visa de cualquier Banco, completando formulario en Administración.',
            'TARJETA DE DÉBITO O CRÉDITO: Visa, Mastercard, American Express, Argencard, Maestro, Diners, Lider, Cabal y Tarjeta Naranja en la terminal Lapost de Administración.',
            'PAGO MIS CUENTAS: por cualquier banco de la Red Banelco.',
          ] } },
        ],
      }),
    },

    // ─── PASTORAL ────────────────────────────────────────────────────────────
    {
      slug: 'pastoral-info',
      title: 'Pastoral - Información General',
      pageGroup: 'pastoral',
      sortOrder: 1,
      content: JSON.stringify({
        blocks: [
          { id: 'pi1', type: 'paragraph', data: { text: '"Inspirados en San Pablo, el patrono de nuestra comunidad, creemos que la pastoral escolar debe ser el encuentro con Jesús en el camino, como le pasó a San Pablo, por eso queremos salir a caminar, a encontrarnos con Jesús, en los demás, y al mismo tiempo desde el encuentro con Jesús, ayudar a otros a que se encuentren con ellos mismos. Que la Pastoral, sea el pastoreo del amor de Dios a nuestros corazones, para que encontrándonos con él y su amor nos encontremos con los demás, y así vivamos juntos el Reino de su Amor".' } },
          { id: 'pi2', type: 'paragraph', data: { text: 'Pbro. Javier Ladrón de Guevara' } },
          { id: 'pi3', type: 'heading', data: { text: 'Fundamentación', level: 2 } },
          { id: 'pi4', type: 'paragraph', data: { text: 'Como comunidad educativa buscamos promover la formación integral de cada alumno/a, como persona consciente, libre, responsable y abierta a la verdad, a través de una Pedagogía Cristocéntrica y de Mística Paulina; que tienda al logro de la síntesis FE, CULTURA Y VIDA.' } },
          { id: 'pi5', type: 'paragraph', data: { text: 'Entendemos la escuela como un espacio social que tiene como función asegurar la comunicación y transmisión cultural. Este encuentro generacional se da en torno al saber conocer, saber hacer, saber ser y saber vivir juntos.' } },
          { id: 'pi6', type: 'paragraph', data: { text: 'Si hablamos de escuela con inspiración cristiana, nos referimos a aquella institución educativa que tiene a Jesucristo como clave de resignificación de los saberes, de orientación de la acción y de la apertura a una esperanza trascendente.' } },
          { id: 'pi7', type: 'paragraph', data: { text: 'Entendemos que la pastoral parte de un serio discernimiento. La pregunta pastoral no es "¿cómo hablaremos de Jesús a los hombres de hoy?". La pregunta pastoral es siempre: "¿cómo habla Jesús en los hombres de hoy?".' } },
          { id: 'pi8', type: 'paragraph', data: { text: 'Este es el punto de partida de la pastoral educativa: una simpatía con el mundo. Más todavía, una mística del mundo, del mundo actual. Una simpatía que es una relación de fe.' } },
          { id: 'pi9', type: 'heading', data: { text: 'Actividades', level: 2 } },
          { id: 'pi10', type: 'paragraph', data: { text: 'Se llevan adelante proyectos de explicitación del proceso de crecimiento en la fe, como el proyecto de convivencias por cursos. Son espacios valiosos donde los estudiantes pueden encontrarse consigo mismos y entre sí de una manera diversa a las dinámicas del ritmo escolar.' } },
          { id: 'pi11', type: 'paragraph', data: { text: 'Se propone trabajar en una jornada temas que respondan a la realidad del curso habiendo previamente realizado el diagnóstico del grupo. Consideramos de suma importancia la realización de estas convivencias que complementan e incentivan el proceso de maduración de los estudiantes.' } },
        ],
      }),
    },
    {
      slug: 'pastoral-galeria',
      title: 'Pastoral - Galería',
      pageGroup: 'pastoral',
      sortOrder: 2,
      content: JSON.stringify({
        blocks: [
          { id: 'pg1', type: 'paragraph', data: { text: 'Galería de imágenes de actividades pastorales. Las fotografías se administran desde el panel de administración.' } },
        ],
      }),
    },
  ]

  for (const section of sections) {
    await prisma.section.upsert({
      where: { slug: section.slug },
      update: {
        title: section.title,
        content: section.content,
        pageGroup: section.pageGroup,
        sortOrder: section.sortOrder,
      },
      create: section,
    })
    console.log(`  ✓ ${section.slug}`)
  }
  console.log(`Upserted ${sections.length} sections`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

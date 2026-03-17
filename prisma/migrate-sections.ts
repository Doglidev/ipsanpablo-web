import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sections = [
  {
    slug: 'pasantias-espacios-curriculares',
    title: 'Espacios Curriculares',
    pageGroup: 'pasantias',
    sortOrder: 2,
    content: JSON.stringify({"blocks":[{"id":"b1","type":"heading","data":{"text":"Espacios Curriculares","level":2}},{"id":"b2","type":"paragraph","data":{"text":"Las pasantías educativas se enmarcan en el espacio curricular de Formación para la Vida y el Trabajo (FVT), que forma parte del plan de estudios del Nivel Secundario. Este espacio tiene como objetivo orientar a los estudiantes en la construcción progresiva de su proyecto de vida en los ámbitos personal y social."}},{"id":"b3","type":"heading","data":{"text":"Materias Involucradas","level":2}},{"id":"b4","type":"list","data":{"style":"unordered","items":["Formación para la Vida y el Trabajo (FVT) — espacio curricular principal","Economía y Gestión — aporte teórico sobre organización empresarial","Tecnología de la Información — herramientas digitales aplicadas","Educación Ciudadana — marco ético y legal del trabajo"]}},{"id":"b5","type":"heading","data":{"text":"Competencias a Desarrollar","level":2}},{"id":"b6","type":"list","data":{"style":"unordered","items":["Competencias básicas: comunicación oral y escrita, cálculo y razonamiento lógico.","Competencias instrumentales: manejo de tecnologías, organización del tiempo y tareas.","Competencias interpersonales: trabajo en equipo, resolución de conflictos, responsabilidad.","Competencias sistémicas: comprensión del funcionamiento de una organización laboral."]}}]}),
  },
  {
    slug: 'pasantias-lugares',
    title: 'Lugares de Pasantías',
    pageGroup: 'pasantias',
    sortOrder: 3,
    content: JSON.stringify({"blocks":[{"id":"b1","type":"heading","data":{"text":"Lugares de Pasantías","level":2}},{"id":"b2","type":"paragraph","data":{"text":"Los alumnos de 6° año realizan sus pasantías en empresas e instituciones de la ciudad de Córdoba que han establecido convenios con el Instituto. Cada lugar ofrece una experiencia diferente según el perfil del pasante."}},{"id":"b3","type":"heading","data":{"text":"Tarjeta Naranja","level":3}},{"id":"b4","type":"paragraph","data":{"text":"Tareas de tipo administrativo en el sector de baja de la tarjeta y en la recepción. Duración de cuatro semanas, cuatro horas diarias."}},{"id":"b5","type":"heading","data":{"text":"Banco Macro","level":3}},{"id":"b6","type":"paragraph","data":{"text":"Tareas de tipo administrativo y financiera. El banco evalúa el sector según el perfil del pasante. Duración de un mes de lunes a viernes en horario bancario."}},{"id":"b7","type":"heading","data":{"text":"JAEC","level":3}},{"id":"b8","type":"paragraph","data":{"text":"Tareas administrativa de organización, clasificación y sistematización de información en formato digital."}},{"id":"b9","type":"heading","data":{"text":"Información General","level":2}},{"id":"b10","type":"list","data":{"style":"unordered","items":["Duración: entre 4 semanas y 1 mes según el lugar","Horario: adaptado al horario del establecimiento receptor","Supervisión: docente tutor del Instituto visita periódicamente al pasante","Evaluación: informe final del pasante + evaluación del tutor laboral"]}}]}),
  },
  {
    slug: 'pasantias-monitoreo',
    title: 'Monitoreo y Evaluación',
    pageGroup: 'pasantias',
    sortOrder: 4,
    content: JSON.stringify({"blocks":[{"id":"b1","type":"heading","data":{"text":"Monitoreo y Evaluación","level":2}},{"id":"b2","type":"paragraph","data":{"text":"El proceso de monitoreo y evaluación de las pasantías es fundamental para garantizar que los estudiantes cumplan con los objetivos pedagógicos planteados. Involucra tanto al Instituto como al lugar donde se realiza la experiencia laboral."}},{"id":"b3","type":"heading","data":{"text":"Rol del Docente Tutor","level":2}},{"id":"b4","type":"list","data":{"style":"unordered","items":["Realiza visitas periódicas al lugar de pasantía","Mantiene contacto con el tutor laboral designado por la empresa","Evalúa la integración del alumno en el entorno laboral","Orienta al pasante ante dificultades o inconvenientes"]}},{"id":"b5","type":"heading","data":{"text":"Instrumentos de Evaluación","level":2}},{"id":"b6","type":"list","data":{"style":"unordered","items":["Planilla de asistencia firmada por el tutor laboral","Informe de desempeño quincenal del tutor de la empresa","Informe final del alumno (reflexión sobre la experiencia)","Evaluación del docente tutor del Instituto"]}},{"id":"b7","type":"heading","data":{"text":"Criterios de Aprobación","level":2}},{"id":"b8","type":"paragraph","data":{"text":"Para la aprobación de las pasantías el alumno deberá: cumplir con el 100% de la asistencia (salvo causas justificadas), obtener una evaluación satisfactoria del tutor laboral, y presentar el informe final en tiempo y forma."}}]}),
  },
  {
    slug: 'secretarias-inicial-primario',
    title: 'Secretaría Nivel Inicial y Primario',
    pageGroup: 'secretarias',
    sortOrder: 1,
    content: JSON.stringify({"blocks":[{"id":"b1","type":"heading","data":{"text":"Secretaría Nivel Inicial y Primario","level":2}},{"id":"b2","type":"heading","data":{"text":"Horarios de Atención","level":3}},{"id":"b3","type":"list","data":{"style":"unordered","items":["Lunes a viernes: 8:00 a 12:30 hs","Lunes a viernes: 16:00 a 19:00 hs"]}},{"id":"b4","type":"heading","data":{"text":"Servicios","level":2}},{"id":"b5","type":"list","data":{"style":"unordered","items":["Inscripción de alumnos nuevos","Emisión de certificados de alumno regular","Certificados de calificaciones","Certificados de conducta","Constancias de asistencia","Trámites de pase y traslado"]}},{"id":"b6","type":"heading","data":{"text":"Protocolo de Admisión","level":2}},{"id":"b7","type":"paragraph","data":{"text":"El Instituto Parroquial San Pablo Apóstol tiene un protocolo de admisión que prioriza el ingreso de familias vinculadas a la institución."}},{"id":"b8","type":"heading","data":{"text":"Orden de Prioridad para la Admisión","level":3}},{"id":"b9","type":"list","data":{"style":"ordered","items":["Hermanos de alumnos actuales del Instituto","Ex alumnos del Instituto (nivel inicial, primario o secundario)","Hijos de ex alumnos del Instituto","Familias nuevas que soliciten inscripción"]}},{"id":"b10","type":"heading","data":{"text":"Documentación Requerida","level":3}},{"id":"b11","type":"list","data":{"style":"unordered","items":["DNI del alumno (original y fotocopia)","Partida de nacimiento","Libreta sanitaria actualizada","Certificado de vacunación","Boletín del año anterior (para pases)","DNI del padre/madre o tutor","2 fotos carnet del alumno"]}}]}),
  },
  {
    slug: 'secretarias-secundario',
    title: 'Secretaría Nivel Secundario',
    pageGroup: 'secretarias',
    sortOrder: 2,
    content: JSON.stringify({"blocks":[{"id":"b1","type":"heading","data":{"text":"Secretaría Nivel Secundario","level":2}},{"id":"b2","type":"heading","data":{"text":"Horarios de Atención","level":3}},{"id":"b3","type":"list","data":{"style":"unordered","items":["Lunes a viernes: 8:00 a 13:00 hs","Lunes a viernes: 17:00 a 20:00 hs"]}},{"id":"b4","type":"heading","data":{"text":"Servicios","level":2}},{"id":"b5","type":"list","data":{"style":"unordered","items":["Inscripción de alumnos nuevos y pases","Emisión de certificados de alumno regular","Certificados de calificaciones (analíticos)","Certificados de conducta","Constancias de asistencia","Tramitación de título secundario","Solicitud de equivalencias"]}},{"id":"b6","type":"heading","data":{"text":"Protocolo de Admisión","level":2}},{"id":"b7","type":"paragraph","data":{"text":"Para el ingreso al Nivel Secundario, los alumnos y sus familias deberán cumplir con el proceso de admisión establecido por el Instituto."}},{"id":"b8","type":"heading","data":{"text":"Requisitos de Ingreso","level":3}},{"id":"b9","type":"list","data":{"style":"unordered","items":["Haber completado el Nivel Primario","DNI del alumno (original y fotocopia)","Certificado de estudios primarios completos","Boletín del último año de primaria","DNI del padre/madre o tutor","Entrevista institucional con equipo directivo"]}},{"id":"b10","type":"heading","data":{"text":"Pases desde Otra Institución","level":3}},{"id":"b11","type":"paragraph","data":{"text":"Los alumnos que soliciten pase desde otra institución deberán presentar además: constancia de baja de la escuela anterior, pase firmado por directivos, analítico de calificaciones y libre deuda de la institución de origen."}}]}),
  },
  {
    slug: 'administracion',
    title: 'Administración',
    pageGroup: 'administracion',
    sortOrder: 1,
    content: JSON.stringify({"blocks":[{"id":"b1","type":"heading","data":{"text":"Administración","level":2}},{"id":"b2","type":"heading","data":{"text":"Horarios de Atención","level":3}},{"id":"b3","type":"list","data":{"style":"unordered","items":["Lunes a viernes: 8:00 a 12:00 hs","Lunes a viernes: 16:00 a 20:00 hs"]}},{"id":"b4","type":"heading","data":{"text":"Aranceles y Pagos","level":2}},{"id":"b5","type":"paragraph","data":{"text":"Los aranceles del ciclo lectivo se informan al inicio de cada año. La cuota mensual vence el día 10 de cada mes. Pasado el vencimiento se aplica un recargo por mora."}},{"id":"b6","type":"heading","data":{"text":"Medios de Pago","level":3}},{"id":"b7","type":"list","data":{"style":"unordered","items":["Efectivo en administración del Instituto","Transferencia bancaria (consultar datos en administración)","Débito automático (solicitar formulario en administración)"]}},{"id":"b8","type":"heading","data":{"text":"Actualización de Datos","level":2}},{"id":"b9","type":"paragraph","data":{"text":"Es importante mantener actualizados los datos de contacto de la familia (teléfono, email, domicilio) para recibir comunicaciones importantes del Instituto."}},{"id":"b10","type":"paragraph","data":{"text":"Para actualizar los datos, completar el formulario de actualización disponible en administración o solicitarlo por correo electrónico a secretaria@ipsanpablo.com."}}]}),
  },
]

async function main() {
  console.log('Upserting sections...')
  for (const section of sections) {
    await prisma.section.upsert({
      where: { slug: section.slug },
      update: {
        title: section.title,
        content: section.content,
        pageGroup: section.pageGroup,
        sortOrder: section.sortOrder,
      },
      create: {
        slug: section.slug,
        title: section.title,
        content: section.content,
        pageGroup: section.pageGroup,
        sortOrder: section.sortOrder,
        isVisible: true,
      },
    })
    console.log(`  - upserted: ${section.slug}`)
  }
  console.log('Done.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

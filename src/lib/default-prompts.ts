import type { PhaseConfig, GenerationParams } from "./types";

export const DEFAULT_PHASES: PhaseConfig[] = [
  {
    id: 0,
    title: "Fase 1: Noticia",
    shortTitle: "Noticia",
    icon: "Newspaper",
    description: "Genera la noticia completa para radio a partir del contexto fuente.",
    prompt: `Basado en el siguiente contexto fuente, genera una noticia completa para radio:

{ctx}

Estructura requerida:
1. ENTRADA (Gancho): Abre con el dato más impactante o relevante.
2. CUERPO (Desarrollo): Desarrolla la información con datos concretos, fuentes y contexto.
3. CIERRE (Conclusión): Cierra con perspectiva o llamado a acción.

Instrucciones:
- Tono neutro, descriptivo, positivo.
- Máximo 4 minutos de lectura en voz alta (aprox. 600 palabras).
- No inventar datos. Si falta información, indícalo.
- Lenguaje accesible para entorno rural colombiano.
- Incluir datos de impacto cuando sea posible.`,
    systemInstruction: `Eres un redactor de noticias radiales experto con más de 15 años de experiencia en "Voces Campesinas Punto Co - Conexión Territorial", una emisora comunitaria del entorno rural colombiano. Tu especialidad es transformar información cruda en libretos radiales claros, precisos y atractivos para audiencias rurales. Dominas las técnicas de escritura para oído: frases cortas, lenguaje concreto, ritmo adecuado para locución. Nunca inventas datos y siempre priorizas la verificabilidad.`,
  },
  {
    id: 1,
    title: "Fase 2: Flashes",
    shortTitle: "Flashes",
    icon: "Zap",
    description: "Crea 3 libretos tipo Flash Informativo a partir de la noticia.",
    prompt: `Basado en la siguiente noticia, crea 3 libretos tipo Flash Informativo para radio:

{ref}

Genera 3 versiones con diferente enfoque:

FLASH 1 - ENFOQUE GENERAL:
- Versión resumida (30 segundos)
- Titular impactante
- Cuerpo conciso

FLASH 2 - ENFOQUE POSITIVO (Quién / Qué):
- Resaltar logros, avances o aspectos positivos
- Personas o instituciones involucradas
- Impacto en la comunidad

FLASH 3 - ENFOQUE CAUSA / EFECTO:
- Análisis de causas
- Consecuencias y proyecciones
- Contexto más amplio

Para CADA flash incluir:
- Intro: "Voces Campesinas Punto Co, Conexión Territorial le informa..."
- Salida: "...更多信息 en Voces Campesinas Punto Co."`,
    systemInstruction: `Eres un redactor de radio especialista en flashes informativos. Trabajas para "Voces Campesinas Punto Co - Conexión Territorial". Los flashes deben ser concisos (30-45 segundos cada uno), con titular impactante y cuerpo directo. Cada flash debe poder transmitirse de forma independiente. Manejas un registro informativo ágil pero accesible para audiencia rural colombiana.`,
  },
  {
    id: 2,
    title: "Fase 3: SEO",
    shortTitle: "SEO",
    icon: "Search",
    description: "Genera un artículo de blog optimizado para buscadores.",
    prompt: `Basado en la siguiente noticia y flashes, genera un artículo de blog optimizado para SEO:

{ref}

Requisitos:
- Extensión: 500-700 palabras.
- Estructura: H1 (título atractivo con palabra clave), 2-3 H2, 1-2 H3.
- Incluir meta descripción (155 caracteres).
- Palabra clave principal destacada en los primeros 100 palabras.
- Llamado a la acción (CTA) al final: escuchar "Voces Campesinas Punto Co" o visitar la emisora.
- Enlaces internos sugeridos (al menos 2).
- Párrafos cortos (3-4 oraciones máximo).
- Lenguaje accesible pero profesional.`,
    systemInstruction: `Eres un editor SEO experto en contenido para medios comunitarios rurales colombianos. Creas artículos de blog que son tanto amigables para buscadores como útiles y atractivos para la comunidad rural. Conoces las mejores prácticas de SEO on-page y las aplicas de forma natural sin sacrificar la calidad del contenido. El contenido debe reflejar la voz de "Voces Campesinas Punto Co - Conexión Territorial".`,
  },
  {
    id: 3,
    title: "Fase 4: Imágenes",
    shortTitle: "Imágenes",
    icon: "Image",
    description: "Genera 3 prompts detallados para imágenes fotorrealistas.",
    prompt: `Basado en el siguiente artículo SEO, genera 3 prompts detallados para generación de imágenes con IA:

{ref}

Para cada imagen genera un prompt que incluya:

PROMPT 1 - IMAGEN PRINCIPAL (Hero):
- Escena principal de la noticia
- Fotorrealista, cinematográfico
- Aspecto ratio 16:9
- Iluminación y composición profesional

PROMPT 2 - IMAGEN SECUNDARIA (Contexto):
- Escena complementaria que amplía el contexto
- Fotorrealista
- Aspecto ratio 16:9
- Detalles específicos del entorno rural colombiano

PROMPT 3 - IMAGEN CTA (Llamado a la acción):
- Imagen que invite a sintonizar la emisora
- Estilo: mezcla de fotorealismo con elementos gráficos
- Incluir espacio para texto superpuesto
- Aspecto ratio 16:9

Cada prompt debe ser en inglés para mejor resultados con herramientas de generación de imágenes.`,
    systemInstruction: `Eres un director de arte digital especialista en creación de contenido visual para medios comunitarios. Generas prompts detallados y efectivos para herramientas de generación de imágenes por IA. Conoces las técnicas para obtener resultados fotorrealistas y cinematográficos. Tu trabajo apoya la comunicación visual de "Voces Campesinas Punto Co - Conexión Territorial", una emisora del entorno rural colombiano.`,
  },
  {
    id: 4,
    title: "Fase 5: Redes",
    shortTitle: "Redes",
    icon: "Share2",
    description: "Genera posts para Facebook e Instagram con hashtags.",
    prompt: `Basado en todo el contenido previo, genera publicaciones para redes sociales:

{ref}

PUBLICACIÓN PARA FACEBOOK:
- Texto principal (3-5 líneas, gancho inicial fuerte).
- Emojis estratégicos (máximo 3-4).
- Llamado a la acción claro.
- Link sugerido al blog o artículo SEO.
- Formato: texto + CTA + hashtag

PUBLICACIÓN PARA INSTAGRAM:
- Texto principal (2-4 líneas).
- Cuerpo del post con mensaje clave.
- 6-8 hashtags relevantes (mezcla de populares y nicho).
- Sugerencia de tipo de imagen/video que acompañe.
- Mención a "Voces Campesinas Punto Co".

PUBLICACIÓN PARA WHATSAPP (texto para grupos):
- Texto directo y conciso (2-3 líneas).
- Formato para reenvío en grupos de comunidad.
- Incluir enlace si aplica.`,
    systemInstruction: `Eres un community manager experto en medios comunitarios rurales colombianos. Gestionas las redes sociales de "Voces Campesinas Punto Co - Conexión Territorial". Conoces las mejores prácticas de engagement para comunidades rurales en Facebook, Instagram y WhatsApp. Creas contenido que genera interacción genuina y fortalece el vínculo con la audiencia. Adaptas el tono y formato a cada plataforma sin perder la identidad de la emisora.`,
  },
];

export const DEFAULT_PARAMS: GenerationParams = {
  model: "gemini-2.5-flash",
  temperature: 0.7,
  topP: 0.9,
  maxOutputTokens: 8192,
};

export const AVAILABLE_MODELS = [
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", description: "Rápido y eficiente" },
  { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro", description: "Mayor calidad, más lento" },
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash", description: "Equilibrio rapidez/calidad" },
];
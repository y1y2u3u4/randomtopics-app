export const privacyPolicy = {
  en: {
    title: "Privacy Policy", updated: "Last updated: October 5, 2026",
    intro: "This policy describes how RandomTopics handles information when you browse, use a generator or choose speech practice. Ordinary topic generation does not require an account. Speech practice has separate account and content storage described below.",
    sections: [
      { id: "practice", title: "Speech accounts and saved practice", paragraphs: [
        "When you choose speech coaching, the service creates or restores a guest account and a browser sign-in session. If email recovery is available and you choose it, we process your email and verification request so you can recover that account. A guest session can become unrecoverable if you clear browser storage before linking and verifying an email.",
        "Saved practice can include the topic, transcript, feedback, duration, practice purpose, previous-attempt link and usage status. Supabase supplies authentication and private database storage. Allowance and subscription records can include payment-provider identifiers and status. We do not publish your practice as a public topic."
      ] },
      { id: "audio", title: "Recording, transcription and feedback", paragraphs: [
        "Microphone access begins when you choose to record. The recording stays in browser memory until you submit it. Submission sends audio through our server to OpenRouter and the selected model provider for transcription. Feedback uses the topic and transcript you review; comparisons also use the earlier attempt.",
        "Our application does not store the raw audio as a saved recording. That does not promise zero retention by providers: their processing and retention policies also apply. Avoid including sensitive information or other people's personal information in a recording. AI transcription and feedback can be wrong; review the words before relying on the feedback."
      ] },
      { id: "deletion", title: "History, deletion and service records", paragraphs: [
        "You can delete a saved practice from its history controls. This removes its transcript and feedback and replaces its topic in the active practice record. Minimal attempt, allowance and usage records remain so deleting content does not reset usage limits. A practice still processing cannot be deleted until processing has finished or failed.",
        "Saved practice remains available until you delete it or request deletion; it is not automatically deleted when you close the page. Service backups may retain earlier copies temporarily. Contact us for account deletion or access/correction requests. Vercel hosts the application, and a keyed hash of the network address is used to help limit abuse and excessive AI usage."
      ] },
      { id: "browser", title: "Browser storage and sharing", paragraphs: [
        "Generators use local or session storage for saved topics, recent results, filters and non-repeating rounds. Some tools store coarse usage times and completion markers to recognize a return within up to 30 days. These markers do not provide cross-device identity. Clearing browser storage removes them and may also remove a guest sign-in session.",
        "A saved speech record is server-side content, unlike a local generator round. If you choose Copy, Share or download, the selected material may leave this site through your clipboard, a share link or the destination you choose. Do not share a link or copied content containing information you want to keep private."
      ] },
      { id: "analytics", title: "Usage analytics", paragraphs: [
        "Public pages use Google Analytics and an additional usage script served from analytics.flashcardmaker.me. Usage information can include page views, interaction events, browser/device information, approximate location and session identifiers. Requests also disclose connection information to the receiving service. Cookies or other browser identifiers are not the same as completely anonymous information.",
        "Our custom speech events describe actions and status, not your audio, transcript or email. Our custom GA page events omit query strings. We do not claim that these limits prevent every form of processing by third-party analytics services. Browser cookie controls and Google's privacy controls provide additional choices."
      ] },
      { id: "replay", title: "Optional Microsoft Clarity replay", paragraphs: [
        "On the English speech page, adults can choose to allow a reconstruction of page interactions such as clicks and scrolling. Replay stays off until you confirm you are at least 18 and allow it. It is not microphone audio or a recording of other applications. Speech text, feedback and email fields are masked; replay tags do not contain speech content or account identifiers.",
        "Replay is not loaded on student pages, account pages or internal reports. Use “Session replay · Change” on the speech page to withdraw permission; practice remains available. Clarity analytics storage is allowed only after this choice, while its advertising storage remains denied. This control applies to Clarity replay, not to every analytics or advertising service on the site."
      ] },
      { id: "ads", title: "Advertising and optional payments", paragraphs: [
        "Selected public content pages may display Google AdSense advertisements. Our initial placement requests non-personalized ads with restricted data processing. These settings do not make advertising anonymous or cookie-free: Google may still process connection and device information and use cookies for purposes such as frequency capping and aggregated reporting, subject to applicable choices. Google’s regional privacy messages collect advertising choices where applicable. When available, use “Advertising privacy choices” below the placement to reopen the message. Browser privacy controls and Google My Ad Center provide additional choices. This advertising control does not change the separate analytics or optional replay controls.",
        "Optional paid speech features use Stripe when enabled. Stripe processes payment details; our application receives identifiers and payment or subscription status rather than your full card details. A helpfulness response or expression of interest in a paid feature is not a purchase."
      ] },
      { id: "choices", title: "Your choices and questions", paragraphs: [
        "You can browse and generate topics without using the microphone, a speech account or paid features. You can clear browser storage, use the history deletion controls and change the optional replay choice. Clearing browser storage does not itself delete a server-side practice record or cancel a subscription.",
        "Depending on your location, you may have rights relating to access, correction, deletion or objection to the processing of personal information. Contact us with the request and enough information to identify the relevant account or record; do not email passwords or full payment details. This page does not promise a particular provider retention period or certify that all processing is anonymous."
      ] },
      { id: "children", title: "Children and sensitive information", paragraphs: [
        "The topic tools serve a general audience and may be used in classrooms. Children under 13 should not use recording, account or payment features. Adults should review a prompt's subject and depth for their group. If you believe a child has supplied personal information through these features, contact us so we can investigate and address it."
      ] }
    ],
    resources: "Service privacy information", contact: "Contact and updates", contactText: "For privacy questions or data requests, contact us at the address below. Changes to this policy appear here with an updated date.", contactLink: "Contact page"
  },
  es: {
    title: "Política de privacidad", updated: "Última actualización: 5 de octubre de 2026",
    intro: "Esta política explica cómo RandomTopics trata la información cuando navegas, utilizas un generador o eliges practicar un discurso. Generar temas no requiere una cuenta. La práctica oral utiliza cuentas y almacenamiento de contenido, como se describe a continuación.",
    sections: [
      { id: "practice", title: "Cuentas y prácticas guardadas", paragraphs: [
        "Cuando eliges la práctica oral con comentarios, el servicio crea o recupera una cuenta de invitado y una sesión de acceso en el navegador. Si la recuperación por correo está disponible y decides usarla, tratamos tu dirección y la solicitud de verificación para que puedas recuperar la cuenta. Una sesión de invitado puede resultar irrecuperable si borras los datos del navegador antes de vincular y verificar un correo.",
        "Una práctica guardada puede incluir el tema, la transcripción, los comentarios, la duración, el objetivo, la referencia al intento anterior y el estado de uso. Supabase proporciona autenticación y almacenamiento privado. Los registros de límites y suscripciones pueden incluir identificadores y estados del proveedor de pagos. No publicamos tu práctica como tema público."
      ] },
      { id: "audio", title: "Grabación, transcripción y comentarios", paragraphs: [
        "El acceso al micrófono comienza cuando decides grabar. El audio permanece en la memoria del navegador hasta que lo envías. Al enviarlo, pasa por nuestro servidor a OpenRouter y al proveedor del modelo seleccionado para su transcripción. Los comentarios utilizan el tema y la transcripción que revisas; las comparaciones también utilizan el intento anterior.",
        "Nuestra aplicación no conserva el audio original como grabación guardada. Esto no garantiza que los proveedores no lo retengan: también se aplican sus políticas de tratamiento y conservación. Evita incluir información sensible o datos personales de otras personas. La transcripción y los comentarios de IA pueden contener errores; revisa las palabras antes de confiar en los comentarios."
      ] },
      { id: "deletion", title: "Historial, eliminación y registros del servicio", paragraphs: [
        "Puedes eliminar una práctica desde los controles del historial. Esto borra su transcripción y comentarios y sustituye el tema en el registro activo. Se conservan registros mínimos del intento, los límites y el uso para que borrar contenido no restablezca el cupo. No se puede eliminar una práctica mientras está procesándose; debe terminar o fallar primero.",
        "Las prácticas permanecen guardadas hasta que las eliminas o solicitas su eliminación; cerrar la página no las borra. Las copias de seguridad pueden conservar versiones anteriores temporalmente. Contáctanos para solicitar la eliminación de la cuenta, el acceso o la corrección de datos. Vercel aloja la aplicación y se utiliza un hash con clave de la dirección de red para limitar abusos y uso excesivo de IA."
      ] },
      { id: "browser", title: "Almacenamiento del navegador y contenido compartido", paragraphs: [
        "Los generadores usan almacenamiento local o de sesión para temas guardados, resultados recientes, filtros y rondas sin repeticiones. Algunas herramientas guardan momentos aproximados de uso y marcadores de finalización para reconocer una vuelta durante un máximo de 30 días. Estos marcadores no identifican a una persona entre dispositivos. Borrar el almacenamiento los elimina y también puede borrar la sesión de invitado.",
        "Una práctica oral guardada es contenido del servidor, a diferencia de una ronda local del generador. Si eliges Copiar, Compartir o descargar, el material seleccionado puede salir del sitio mediante el portapapeles, un enlace o el destino que elijas. No compartas enlaces ni contenido que incluyan información que quieras mantener privada."
      ] },
      { id: "analytics", title: "Estadísticas de uso", paragraphs: [
        "Las páginas públicas utilizan Google Analytics y otro script de estadísticas servido desde analytics.flashcardmaker.me. La información de uso puede incluir visitas, eventos de interacción, datos del navegador y dispositivo, ubicación aproximada e identificadores de sesión. Las solicitudes también revelan datos de conexión al servicio receptor. Las cookies y otros identificadores del navegador no equivalen a información completamente anónima.",
        "Nuestros eventos personalizados de práctica oral describen acciones y estados, no tu audio, transcripción ni correo. Nuestros eventos de página de GA omiten los parámetros de consulta de la URL. Estos límites no impiden necesariamente todos los tratamientos realizados por servicios externos. Los controles de cookies del navegador y los controles de privacidad de Google ofrecen opciones adicionales."
      ] },
      { id: "replay", title: "Reproducción opcional con Microsoft Clarity", paragraphs: [
        "En la página de práctica oral en inglés, las personas adultas pueden permitir una reconstrucción de interacciones, como clics y desplazamientos. Permanece desactivada hasta que confirmas tener al menos 18 años y la autorizas. No es una grabación del micrófono ni de otras aplicaciones. El texto del discurso, los comentarios y los campos de correo se enmascaran; las etiquetas de reproducción no contienen el discurso ni identificadores de cuenta.",
        "No se carga en páginas para estudiantes, páginas de cuenta ni informes internos. Usa “Session replay · Change” en la página de práctica oral para retirar el permiso; puedes seguir practicando. Clarity permite almacenamiento analítico tras esa elección y mantiene denegado el almacenamiento publicitario. Este control solo corresponde a Clarity, no a todos los servicios de estadísticas o publicidad del sitio."
      ] },
      { id: "ads", title: "Publicidad y pagos opcionales", paragraphs: [
        "Algunas páginas de contenido público pueden mostrar anuncios de Google AdSense. La ubicación inicial solicita anuncios no personalizados con procesamiento de datos restringido. Estas opciones no hacen que la publicidad sea anónima ni eliminen todas las cookies: Google puede tratar datos de conexión y dispositivo y usar cookies para limitar la frecuencia y elaborar informes agregados, según las opciones aplicables. Los mensajes regionales de Google recogen las preferencias publicitarias cuando corresponde. Cuando esté disponible, utiliza “Advertising privacy choices” debajo del anuncio para volver a abrir el mensaje. Los controles del navegador y Mi centro de anuncios de Google ofrecen otras opciones. Este control publicitario no cambia los controles separados de estadísticas o reproducción opcional.",
        "Las funciones de pago opcionales de práctica oral usan Stripe cuando están habilitadas. Stripe procesa los datos del pago; nuestra aplicación recibe identificadores y estados del pago o suscripción, no todos los datos de tu tarjeta. Una valoración de utilidad o una respuesta de interés en una función de pago no constituye una compra."
      ] },
      { id: "choices", title: "Tus opciones y consultas", paragraphs: [
        "Puedes navegar y generar temas sin utilizar el micrófono, una cuenta de práctica oral ni funciones de pago. Puedes borrar el almacenamiento del navegador, eliminar prácticas del historial y cambiar el permiso de reproducción. Borrar el almacenamiento no elimina por sí solo una práctica del servidor ni cancela una suscripción.",
        "Según dónde te encuentres, puedes tener derechos de acceso, corrección, eliminación u oposición al tratamiento de datos personales. Contáctanos con tu solicitud y la información necesaria para identificar la cuenta o registro; no envíes contraseñas ni datos completos de pago por correo. Esta página no garantiza un plazo concreto de conservación por parte de los proveedores ni que todo tratamiento sea anónimo."
      ] },
      { id: "children", title: "Menores e información sensible", paragraphs: [
        "Las herramientas de temas se dirigen a un público general y pueden utilizarse en clase. Los menores de 13 años no deben usar funciones de grabación, cuenta o pago. Las personas adultas deben revisar el tema y su profundidad antes de usarlo con un grupo. Si crees que un menor ha proporcionado información personal mediante estas funciones, contáctanos para que podamos investigarlo y atenderlo."
      ] }
    ],
    resources: "Información de privacidad de los servicios", contact: "Contacto y actualizaciones", contactText: "Para consultas de privacidad o solicitudes sobre tus datos, utiliza la dirección indicada abajo. Los cambios en esta política se publican aquí con una fecha actualizada.", contactLink: "Página de contacto"
  }
} as const;

import { Helmet } from 'react-helmet-async'

const BASE_URL    = 'https://portfolio-gt1z.onrender.com'
const DEFAULT_IMG = `${BASE_URL}/og-image.png`
const SITE_NAME   = 'Danish Raza'

export default function SEOMeta({
  title,
  description = 'Full-stack MERN developer and AI Integration Specialist based in Peshawar, Pakistan. Architected BotForge with ~90% RAG retrieval accuracy.',
  image,
  path = '/',
  type = 'website',
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — MERN Stack Developer & AI Integration Specialist`
  const fullUrl   = `${BASE_URL}${path}`
  const ogImage   = image || DEFAULT_IMG

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description"        content={description} />
      <link rel="canonical"           href={fullUrl} />

      <meta property="og:type"        content={type} />
      <meta property="og:url"         content={fullUrl} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:site_name"   content={SITE_NAME} />

      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />
    </Helmet>
  )
}

// URL helper utilities
export const getBaseUrl = (req) => {
  const protocol = req.get('x-forwarded-proto') || req.protocol || 'https'
  const host = req.get('host') || req.get('x-forwarded-host') || 'api.mason.id.vn'
  const finalProtocol = protocol === 'https' || host.includes('vercel.app') || host.includes('mason.id.vn') 
    ? 'https' 
    : protocol
  return `${finalProtocol}://${host}`
}


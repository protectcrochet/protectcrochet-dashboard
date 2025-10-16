import { createHash } from 'crypto'
import sharp from 'sharp'

export async function generateImageHash(buffer: Buffer) {
  const resized = await sharp(buffer)
    .resize(16, 16, { fit: 'cover' })
    .grayscale()
    .raw()
    .toBuffer()

  return createHash('md5').update(resized).digest('hex')
}

export function compareHashes(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return 0
  let diff = 0
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++
  return 1 - diff / a.length
}

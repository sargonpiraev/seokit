import { z } from 'zod'

const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
})

export const env = schema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
})

import { z } from 'zod'

const schema = z.object({
  DOCS_BASE_PATH: z.string().optional(),
})

export const env = schema.parse({
  DOCS_BASE_PATH: process.env.DOCS_BASE_PATH,
})

import { loadWorkspaceEnv } from './workspace-env.ts'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as pulumi from '@pulumi/pulumi'
import { repoHasWebapp } from '@sargonpiraev/pulumi-apps'
import { webapp } from '../apps/webapp/pulumi.ts'

/**
 * Product analytics + Vercel (shared Webapp).
 * GSC URL-prefix: live Fumadocs on GitHub Pages.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
process.env.PATH = `${path.join(__dirname, 'node_modules', '.bin')}:${process.env.PATH ?? ''}`
loadWorkspaceEnv(__dirname)

if (!repoHasWebapp(repoRoot)) {
  throw new Error('seokit expects apps/webapp — product analytics (GSC + BQ export) are required')
}

export const vercelProjectId = webapp.vercelProjectId
export const vercelProjectUrl = pulumi.interpolate`https://vercel.com/${webapp.vercelProject.name}`
export const gscSiteUrl = webapp.gscSiteUrl
export const gscExportDatasetId = webapp.datasetId
export const ga4MeasurementId = webapp.ga4MeasurementId
export const ga4PropertyId = webapp.ga4PropertyId

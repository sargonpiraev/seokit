import { loadWorkspaceEnv } from './workspace-env.ts'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as pulumi from '@pulumi/pulumi'
import { createWebappProductAnalytics, repoHasWebapp } from './webapp-analytics.ts'

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

const webappAnalytics = createWebappProductAnalytics({
  datasetId: 'searchconsole_seokit',
  location: 'EU',
  gscSiteUrl: 'https://sargonpiraev.github.io/seokit/',
  gscServiceAccountKeyB64: process.env.GOOGLE_SERVICE_ACCOUNT_KEY!,
  gcpServiceAccountKeyB64: process.env.GCP_SERVICE_ACCOUNT_KEY!,
  vercelApiToken: process.env.VERCEL_API_TOKEN!,
})

export const vercelProjectId = webappAnalytics.vercelProjectId
export const vercelProjectUrl = pulumi.interpolate`https://vercel.com/${webappAnalytics.vercelProject.name}`
export const gscSiteUrl = webappAnalytics.gscSiteUrl
export const gscExportDatasetId = webappAnalytics.datasetId
export const ga4MeasurementId = webappAnalytics.ga4MeasurementId
export const ga4PropertyId = webappAnalytics.ga4PropertyId

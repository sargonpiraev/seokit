import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Webapp, pageTypesFromOrigin } from '@sargonpiraev/pulumi-apps'
import { parseWebappEnv } from '@sargonpiraev/pulumi-apps/webapp/env'
import { loadWorkspaceEnv } from '../../pulumi/workspace-env.ts'

const pulumiDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../pulumi')
process.env.PATH = `${path.join(pulumiDir, 'node_modules', '.bin')}:${process.env.PATH ?? ''}`
loadWorkspaceEnv(pulumiDir)
const env = parseWebappEnv()

export const webapp = new Webapp('webapp', {
  productId: 'seokit',
  gcpProjectId: 'sargonpiraev',
  datasetId: 'searchconsole_seokit',
  location: 'EU',
  gscSiteUrl: 'https://sargonpiraev.github.io/seokit/',
  gscServiceAccountKeyB64: env.GOOGLE_SERVICE_ACCOUNT_KEY,
  gcpServiceAccountKeyB64: env.GCP_SERVICE_ACCOUNT_KEY,
  datasetDescription: 'GSC bulk export for sargonpiraev.github.io/seokit',
  datasetLabels: {
    product: 'seokit',
    source: 'gsc',
    domain: 'product',
  },
  importGscExportTables: true,
  importAnalyticsDataset: false,
  pageTypes: pageTypesFromOrigin({
    origin: 'https://sargonpiraev.github.io/seokit',
    localePrefix: 'always',
    paths: [
      { id: 'pokemon_detail', pathname: '/pokemon/[^/?#]+/?' },
      { id: 'generation_detail', pathname: '/generations/[^/?#]+/?' },
      { id: 'type_detail', pathname: '/types/[^/?#]+/?' },
      { id: 'pokemon_list', pathname: '/pokemon/?' },
      { id: 'generation_list', pathname: '/generations/?' },
      { id: 'type_list', pathname: '/types/?' },
      { id: 'home', pathname: '/?' },
    ],
  }),
  vercel: {
    apiToken: env.VERCEL_API_TOKEN,
    name: 'seokit',
    gitRepository: 'sargonpiraev/seokit',
  },
})

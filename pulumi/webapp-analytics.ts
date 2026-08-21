import { Webapp, WEBAPP_TYPE, repoHasWebapp } from '@sargonpiraev/pulumi-apps'

export { Webapp, WEBAPP_TYPE, repoHasWebapp }

export type SeokitWebappArgs = {
  datasetId: string
  location: string
  gscSiteUrl: string
  gscServiceAccountKeyB64: string
  gcpServiceAccountKeyB64: string
  vercelApiToken: string
}

/**
 * seokit public docs (`apps/docapp` on GitHub Pages) + demo `apps/webapp`.
 * One Webapp cluster; GSC URL-prefix is the live docs site.
 */
export function createWebappProductAnalytics(args: SeokitWebappArgs): Webapp {
  return new Webapp('webapp-analytics', {
    gcpProjectId: 'sargonpiraev',
    datasetId: args.datasetId,
    location: args.location,
    gscSiteUrl: args.gscSiteUrl,
    gscServiceAccountKeyB64: args.gscServiceAccountKeyB64,
    gcpServiceAccountKeyB64: args.gcpServiceAccountKeyB64,
    datasetDescription: 'GSC bulk export for sargonpiraev.github.io/seokit',
    datasetLabels: {
      product: 'seokit',
      source: 'gsc',
      domain: 'product',
    },
    vercel: {
      apiToken: args.vercelApiToken,
      name: 'seokit',
      gitRepository: 'sargonpiraev/seokit',
    },
  })
}

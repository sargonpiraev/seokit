import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'seokit',
    },
    links: [
      {
        text: 'GitHub',
        url: 'https://github.com/sargonpiraev/seokit/tree/main/packages/seokit',
        external: true,
      },
      {
        text: 'npm',
        url: 'https://www.npmjs.com/package/@sargonpiraev/seokit',
        external: true,
      },
    ],
  }
}

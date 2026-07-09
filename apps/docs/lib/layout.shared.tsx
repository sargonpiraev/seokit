import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'seodit',
    },
    links: [
      {
        text: 'GitHub',
        url: 'https://github.com/sargonpiraev/seodit/tree/main/packages/seodit',
        external: true,
      },
      {
        text: 'npm',
        url: 'https://www.npmjs.com/package/@sargonpiraev/seodit',
        external: true,
      },
    ],
  }
}

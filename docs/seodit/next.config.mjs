import { createMDX } from 'fumadocs-mdx/next'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const reactProduction = path.resolve(__dirname, '../../node_modules/react/cjs/react.production.js')
const reactDevelopment = path.resolve(__dirname, '../../node_modules/react/cjs/react.development.js')
const reactDomProduction = path.resolve(
  __dirname,
  '../../node_modules/react-dom/cjs/react-dom.production.js',
)
const reactDomDevelopment = path.resolve(
  __dirname,
  '../../node_modules/react-dom/cjs/react-dom.development.js',
)

/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ['@sargonpiraev/seodit'],
  outputFileTracingRoot: path.join(__dirname, '../..'),
  async rewrites() {
    return [
      {
        source: '/docs/:path*.md',
        destination: '/llms.mdx/docs/:path*',
      },
    ]
  },
  webpack: (webpackConfig, { dev }) => {
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      react: dev ? reactDevelopment : reactProduction,
      'react-dom': dev ? reactDomDevelopment : reactDomProduction,
    }
    return webpackConfig
  },
}

const withMDX = createMDX()

export default withMDX(config)

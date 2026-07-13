module.exports = {
  branches: ["main"],
  tagFormat: "seokit-v${version}",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { scope: "seokit", breaking: true, release: "major" },
          { scope: "seokit", type: "feat", release: "minor" },
          { scope: "seokit", type: "fix", release: "patch" },
          { scope: "seokit", type: "perf", release: "patch" },
          { scope: "seokit", type: "chore", release: false },
          { scope: "seokit", type: "docs", release: false },
          { scope: "seokit", type: "test", release: false },
          { scope: "seokit", type: "refactor", release: false },
          { scope: "seokit", type: "ci", release: false },
          { scope: "seokit", type: "build", release: false },
          { scope: "!seokit", release: false },
        ],
      },
    ],
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/npm",
      {
        pkgRoot: ".",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["package.json"],
        message: "chore(seokit): release ${nextRelease.version} [skip ci]",
      },
    ],
    [
      "@semantic-release/github",
      {
        labels: false,
        successComment: false,
        failComment: false,
      },
    ],
  ],
};

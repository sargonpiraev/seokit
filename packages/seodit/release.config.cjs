module.exports = {
  branches: ["main"],
  tagFormat: "seodit-v${version}",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { scope: "seodit", breaking: true, release: "major" },
          { scope: "seodit", type: "feat", release: "minor" },
          { scope: "seodit", type: "fix", release: "patch" },
          { scope: "seodit", type: "perf", release: "patch" },
          { scope: "seodit", type: "chore", release: false },
          { scope: "seodit", type: "docs", release: false },
          { scope: "seodit", type: "test", release: false },
          { scope: "seodit", type: "refactor", release: false },
          { scope: "seodit", type: "ci", release: false },
          { scope: "seodit", type: "build", release: false },
          { release: false },
        ],
      },
    ],
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/github",
  ],
};

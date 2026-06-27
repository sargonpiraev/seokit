# sargonpiraev/shared

Reusable GitHub Actions for turborepo projects.

## Workflows

| File | Trigger (in consumer) | Jobs |
|------|----------------------|------|
| `workflow-call-turborepo-ci.yml` | `push` / `pull_request` | lint, check-types, format, build (parallel) |
| `hello.yml` | manual test | hello world |

Pin: `@v1` — not `@main`.

## Consumer example

```yaml
# .github/workflows/push-main.yml
name: Push main branch

on:
  push:
    branches: [main]

jobs:
  ci:
    uses: sargonpiraev/shared/.github/workflows/workflow-call-turborepo-ci.yml@v1
    secrets: inherit
```

Requires root scripts: `lint`, `check-types`, `build`.

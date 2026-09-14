pnpm -F eslint-config-bananagrams build
pnpm -F bananagrams-utils build

concurrently --kill-others --handle-input \
  "pnpm -r --parallel watch" \
  "spacetime start" \
  "spacetime dev"

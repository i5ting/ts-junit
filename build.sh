#!/usr/bin/env sh

pnpm --filter  @ts-junit/utils build
pnpm --filter  @ts-junit/decorator build
pnpm --filter  @ts-junit/strategy build
pnpm --filter  @ts-junit/core build
pnpm --filter  @ts-junit/cli build
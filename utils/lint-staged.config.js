/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default {
  "*.js": ["eslint --fix", "prettier --write"],
  "*.{ts,tsx}": ["eslint --fix", "prettier --write", () => "tsc --noEmit"],
  "*.{json,md}": "prettier --write",
};

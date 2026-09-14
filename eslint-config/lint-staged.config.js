export default {
  "*.{js,json,md}": "prettier --write",
  "*.ts": ["prettier --write", () => "tsc --noEmit"],
};

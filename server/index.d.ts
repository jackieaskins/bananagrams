declare module 'check-word' {
  export default function (
    language: string
  ): { check: (word: string) => boolean };
}

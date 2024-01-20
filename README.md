# Bananagrams

**Website:** [https://bananagrams.jackieaskins.com](https://bananagrams.jackieaskins.com)

![Screenshot exhibiting Bananagrams gameplay](https://github.com/jackieaskins/bananagrams/assets/11819607/387d071a-932a-4bab-a262-b7af6f089bfa)

## Helpful Dependency Docs

- [Chakra UI](https://chakra-ui.com/) - React component library
- [Jest](https://jestjs.io/docs/getting-started) - Unit test framework
- [Konva](https://konvajs.org/docs/index.html) & [React Konva](https://konvajs.org/docs/react/index.html) - HTML Canvas wrapper used for game board
- [Playwright](https://playwright.dev/docs/intro) - End-to-end testing framework
- [React Icons](https://react-icons.github.io/react-icons/icons/fa6/) & [Font Awesome](https://fontawesome.com/search?o=r&m=free) - Icon provider, app uses Font Awesome 6 icons
- [React Router](https://reactrouter.com/en/main/start/overview)
- [React Testing Library](https://testing-library.com/docs/)
- [Socket.IO](https://socket.io/docs/v4/)

## Development

The project is managed using [NPM Workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces), with the following workspaces:

- `eslint-config`: Common ESLint rules shared between packages
- `app`: Server and client code
- `e2e`: Playwright integration tests

This package enforces [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), be sure to follow the standards when creating commit messages.

### Commands

Before running any of the below commands, be sure to install dependencies:

```bash
npm install
```

#### Dev Server

Run the local server with hot reload. This starts the server on port 3000:

```bash
npm run dev
```

#### Production Server

Run the server in production mode. This starts the server on port 3000:

```bash
npm run build && npm run start
```

#### Testing

Run the app's unit tests:

```bash
npm run -w app test
```

Run the app's unit tests in watch mode:

```bash
npm run -w app test:watch
```

Run the Playwright integration tests in headless mode. This will start up a production server on port 3001 to run the tests against:

```bash
npm run -w e2e test
```

Run the Playwright integration tests using in [UI mode](https://playwright.dev/docs/test-ui-mode). This will start or re-use an active dev server on port 3000. This mode allows for quick turn around while debugging issues:

```bash
npm run -w e2e ui
```

Run the unit tests followed by Playwright integration tests:

```bash
npm run test
```

#### Types, Linting & Formatting

Consider setting up your text editor of choice to auto-format and show errors and warnings while developing.

- [TypeScript Language Server](https://github.com/typescript-language-server/typescript-language-server)
- [Prettier editor integration](https://prettier.io/docs/en/editors)
- [ESLint editor integration](https://eslint.org/docs/latest/use/integrations#editors)

The below commands can be targeted to a specific package by adding `-w app` or `-w e2e` to the command.

Check for TypeScript type errors:

```bash
npm run check-types
```

Check for ESLint errors:

```bash
npm run lint
```

Check for ESLint errors and fix and auto-fixable errors:

```bash
npm run lint:fix
```

Format with Prettier:

```bash
npm run format
```

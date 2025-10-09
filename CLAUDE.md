# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repository contains a collection of Web Components built by Clever Cloud using Lit. Components range from low-level atoms (`cc-button`, `cc-input-text`, `cc-loader`) to high-level domain-specific components for Clever Cloud's products. Components are showcased in Storybook and distributed via npm as `@clevercloud/components`.

## Development Commands

### Essential Commands
```bash
# Start Storybook development server (port 6006)
npm run storybook:dev

# Run all tests
npm run test

# Run tests for a specific file
npm run test path/to/test-file

# Run tests for a specific group (e.g., unit, test:cc-button, a11y:cc-button)
npm run test:group <group-name>

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Lint code with autofix
npm run lint:fix

# Format code with Prettier
npm run format

# Typecheck JavaScript files
npm run typecheck

# Build components for npm distribution
npm run components:build

# Build Storybook for production
npm run storybook:build
```

### Testing Workflow
- Unit tests: `npm run test:group unit`
- Component-specific tests: `npm run test:group test:cc-button`
- Component accessibility tests: `npm run test:group a11y:cc-button`
- Watch mode with focus: `npm run test:watch` then press `F` to focus on a file
- Debug mode: `npm run test:watch` then press `D` to debug in browser

### Code Quality
- Run `npm run stylelint` to check CSS-in-JS styles
- Run `npm run components:check-lit` for Lit-specific validation
- Run `npm run components:check-i18n` to verify translations
- Run `npm run components:check-type-imports` to validate TypeScript imports

## Architecture

### Component Structure

Components live in `src/components/` with the following structure:
```
src/components/cc-button/
├── cc-button.js           # Main component (LitElement)
├── cc-button.stories.js   # Storybook stories
├── cc-button.test.js      # Unit tests (optional)
├── cc-button.events.js    # Event definitions (optional)
└── cc-button.smart.js     # Smart component (optional)
```

### Smart Components

Smart components connect UI components with data-fetching logic. They use a context-based system:
- **Smart definition files** (`*.smart.js`): Define data fetching, API calls, and state management
- **Smart container** (`cc-smart-container`): Provides context to smart components
- **Smart manager** (`src/lib/smart/smart-manager.js`): Orchestrates the connection between containers and components

Key characteristics:
- Use `defineSmartComponent()` to create smart components
- Must define `selector` and `params` (context requirements)
- Must have at least one non-optional parameter
- Use `onContextUpdate()` callback to react to context changes
- Use `updateComponent()` helper (powered by Immer) for state updates
- Always wrap smart components in `<cc-smart-container>` in HTML

### Translation System

- Translations are defined in `src/translations/`
- Use `i18n()` function from `src/translations/translation.js`
- Language files follow pattern: `translations.<lang>.js`
- Check translations with `npm run components:check-i18n`

### Events

- Custom events use the pattern defined in `src/components/common.events.js`
- Component-specific events go in `cc-*.events.js` files
- Event map is auto-generated with `npm run components:events-map-generate`
- Verify event map is up-to-date with `npm run components:events-map-check`

### Styling

- Components use Lit's `css` tagged template for styles
- Skeleton states use `src/styles/skeleton.js`
- CSS-in-JS is linted with stylelint using `postcss-styled-syntax`
- Design tokens are available (see `docs/getting-started/design-tokens.md`)

### Assets and Icons

- Icons from Remix Icon are used throughout
- Generate icon assets with `npm run components:generate-icons-assets`
- SVG assets are handled via `new URL('...', import.meta.url)` pattern
- Images go in `src/assets/`

## Component Guidelines

### Creating Components

Components are LitElement-based with:
- TypeScript JSDoc type annotations for type safety
- Properties defined in `static get properties()`
- Rendering in `render()` method using `html` template
- Styles in `static get styles()`

### Testing

- Tests use `@web/test-runner` with Chrome
- Accessibility tests run automatically on story files
- Visual tests run on-demand in CI with `run-visual-tests` label
- Tests are emulated in Europe/Paris timezone

### Forms

- Form-associated components use `static get formAssociated()`
- See `docs/contributing/forms.md` for form patterns

## Build and Distribution

### Build Process

- Rollup bundles components for npm (`rollup/rollup-npm.config.js`)
- Terser minifies JavaScript
- `babel-plugin-template-html-minifier` minifies HTML/CSS in templates
- Output goes to `dist/` directory
- Custom Elements Manifest generated with `cem analyze`

### Publishing

- Components distributed via npm as `@clevercloud/components`
- Import pattern: `import '@clevercloud/components/dist/cc-button.js'`
- `prepack` script runs full validation before publishing

### CDN Preview/Release

- CDN builds use separate Rollup config (`rollup/rollup-cdn*.config.js`)
- Preview commands: `npm run cdn-preview:*`
- Release commands: `npm run cdn-release:*`

## Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org):
- Types: `fix:`, `feat:`, `build:`, `chore:`, `ci:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`
- Scope should be component name (e.g., `fix(cc-button): ...`)
- For multi-component changes, use main component or omit scope
- Set up commit hooks: `git config core.hooksPath '.githooks'`

## Key Libraries and Tools

- **Lit 3.x**: Web Components framework
- **Storybook 9.x**: Component showcase and documentation
- **Web Test Runner**: Testing with real browsers
- **ESLint**: Linting (based on standardJS)
- **TypeScript**: Type-checking JavaScript via JSDoc
- **Rollup**: Bundling for distribution
- **@clevercloud/client**: API client for Clever Cloud services
- **Immer**: Immutable state updates in smart components
- **Leaflet**: Map components (modified fork in `src/lib/leaflet/`)

## Important Notes

- Node 22.17.1 and npm 11.4.2 specified via Volta
- Main branch is `master`
- TypeScript is used only for type-checking, not compilation
- `strictNullChecks` is disabled; `null` and `undefined` treated as equivalent
- Files longer than 2000 characters get truncated in line numbers
- Always prefer editing existing files over creating new ones
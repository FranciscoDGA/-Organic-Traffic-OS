# Development Guidelines

1. **Strict Typing**: All parameters must be explicitly typed. No implicit `any`.
2. **Kebab-Case**: Folder and file names must use kebab-case (e.g., `natural-language-engine.ts`).
3. **Engine Pattern**: Every module must expose an `Engine` (business logic), a `Validator` (integrity), and a `Service` (API interface).
4. **Resilience**: Avoid failing silently. Any missing artifact in the pipeline must throw a documented Error.

# LLM content maintenance checklist

Before publishing or changing a page listed in `llms.txt`:

- Confirm that the page is public, canonical, indexable and returns `200`.
- Check the title, description, visible answer, sources, dates and internal links.
- Remove a link when the page becomes private, thin, redirected, outdated or unsupported.
- Recheck commercial wording against the [evidence register](../rights-evidence-register.md).
- Run `npm run geo:check` and the release gate after changing public route coverage.

Do not add model-specific files or duplicate an article for AI systems. Improve the public page instead.

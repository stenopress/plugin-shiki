# @steno/plugin-shiki

Syntax highlighting plugin for [Steno](https://github.com/steno/steno) powered
by [Shiki](https://shiki.style).

Automatically highlights fenced code blocks in your Markdown content using all
bundled languages.

## Installation

```yaml
# content/.steno/config.yml
plugins:
  - jsr:@steno/plugin-shiki
```

## Options

```yaml
plugins:
  - package: jsr:@steno/plugin-shiki
    options:
      theme: github-light
```

| Option  | Type     | Default       | Description                                           |
| ------- | -------- | ------------- | ----------------------------------------------------- |
| `theme` | `string` | `github-dark` | Any [Shiki bundled theme](https://shiki.style/themes) |

## Usage

Write fenced code blocks in your Markdown as usual:

````md
```ts
const greeting = "Hello from Steno!";
console.log(greeting);
```
````

The plugin finds all `<pre><code class="language-*">` blocks in the rendered
HTML and replaces them with Shiki-highlighted output.

All [Shiki bundled languages](https://shiki.style/languages) are supported out
of the box — no configuration needed.

## How it works

The plugin hooks into Steno's `transformHtml` pipeline. After `marked` converts
your Markdown to HTML, the plugin:

1. Finds all fenced code blocks by their `language-*` class
2. Decodes any HTML entities marked added
3. Runs the code through Shiki with the configured theme
4. Replaces the plain block with Shiki's highlighted output

The Shiki highlighter is created once at plugin init and reused across all
pages, so build performance stays fast.

## License

MIT

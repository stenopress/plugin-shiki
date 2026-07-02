/**
 * Steno plugin for syntax highlighting using Shiki.
 *
 * @example
 * ```yaml
 * plugins:
 *   - jsr:@steno/plugin-shiki
 * ```
 *
 * @example with options
 * ```yaml
 * plugins:
 *   - package: jsr:@steno/plugin-shiki
 *     options:
 *       theme: github-light
 * ```
 *
 * @module
 */

import { bundledLanguages, createHighlighter } from "shiki";
import type { StenoPlugin } from "steno";

export interface ShikiPluginOptions {
  theme?: string;
}

export default function shikiPlugin(
  options: ShikiPluginOptions = {},
): StenoPlugin {
  const theme = options.theme ?? "github-dark";

  const highlighterPromise = createHighlighter({
    themes: [theme],
    langs: Object.keys(bundledLanguages),
  });

  return {
    name: "steno-plugin-shiki",
    transformHtml: async (html: string): Promise<string> => {
      const highlighter = await highlighterPromise;

      return html.replace(
        /<pre><code class="language-([\w-]+)">([\s\S]*?)<\/code><\/pre>/g,
        (_match, lang, rawCode) => {
          const code = rawCode
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");

          const supportedLangs = highlighter.getLoadedLanguages();
          const resolvedLang = supportedLangs.includes(lang) ? lang : "text";

          return highlighter.codeToHtml(code.trimEnd(), {
            lang: resolvedLang,
            theme,
          });
        },
      );
    },
  };
}

import { assertStringIncludes, assert } from "@std/assert";
import shikiPlugin from "./mod.ts";

Deno.test({
    name: "shiki: highlights a typescript code block",
    fn: async () => {
        const plugin = shikiPlugin();
        const html = `<pre><code class="language-ts">const x = 1;</code></pre>`;
        const result = await plugin.transformHtml!(html);

        // Shiki wraps output in <pre class="shiki ...">
        assertStringIncludes(result, "shiki");
        assertStringIncludes(result, "const");
    },
});

Deno.test({
    name: "shiki: falls back to text for unknown language",
    fn: async () => {
        const plugin = shikiPlugin();
        const html = `<pre><code class="language-unknownlang">hello</code></pre>`;
        const result = await plugin.transformHtml!(html);

        assertStringIncludes(result, "shiki");
        assertStringIncludes(result, "hello");
    },
});

Deno.test({
    name: "shiki: leaves non-code html untouched",
    fn: async () => {
        const plugin = shikiPlugin();
        const html = `<p>Hello <strong>world</strong></p>`;
        const result = await plugin.transformHtml!(html);

        assert(result === html);
    },
});

Deno.test({
    name: "shiki: decodes html entities before highlighting",
    fn: async () => {
        const plugin = shikiPlugin();
        const html = `<pre><code class="language-ts">const x = a &lt; b;</code></pre>`;
        const result = await plugin.transformHtml!(html);

        assertStringIncludes(result, "shiki");
        assertStringIncludes(result, "&#x3C;");
    },
});

Deno.test({
    name: "shiki: respects custom theme option",
    fn: async () => {
        const plugin = shikiPlugin({ theme: "github-light" });
        const html = `<pre><code class="language-ts">const x = 1;</code></pre>`;
        const result = await plugin.transformHtml!(html);

        assertStringIncludes(result, "github-light");
    },
});

Deno.test({
    name: "shiki: highlighter is reused across multiple calls",
    fn: async () => {
        const plugin = shikiPlugin();
        const html = `<pre><code class="language-ts">const x = 1;</code></pre>`;

        const [r1, r2] = await Promise.all([
            plugin.transformHtml!(html),
            plugin.transformHtml!(html),
        ]);

        assert(r1 === r2);
    },
});
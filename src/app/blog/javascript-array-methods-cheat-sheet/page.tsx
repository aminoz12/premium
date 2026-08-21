import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = buildPageMetadata({
  title: "JavaScript Array Methods Cheat Sheet: map, filter, reduce and the Rest",
  description:
    "The JavaScript array methods you use every day â€” map, filter, reduce, find, some, every, flat, flatMap â€” explained with real examples.",
  path: "/blog/javascript-array-methods-cheat-sheet",
})

export default function Post() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <Navbar />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="datePublished" content="2026-06-02" />
        <meta itemProp="dateModified" content="2026-06-02" />
        <meta itemProp="author" content="Achraf A." />

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-xs text-black/60 dark:text-white/60">
            <time dateTime="2026-06-02">June 2, 2026</time>
            <span>Â·</span>
            <span>7 min read</span>
            <span>Â·</span>
            <Link href="/blog" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Blog</Link>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl" itemProp="headline">
            JavaScript Array Methods Cheat Sheet: map, filter, reduce and the Rest
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-black/60 dark:text-white/60">
            These 15 array methods cover 95% of what you need in everyday JavaScript. Each one explained with a real example â€” not a toy example about fruits.
          </p>
        </header>

        <div
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-black prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:opacity-60"
          itemProp="articleBody"
        >
          <h2>Transformation methods (return a new array)</h2>

          <h3>map() â€” transform each element</h3>
          <pre><code>{`const users = [
  { id: 1, name: "Alice", active: true },
  { id: 2, name: "Bob", active: false },
];

// Extract just the names
const names = users.map(u => u.name);
// ["Alice", "Bob"]

// Add a computed field
const withLabel = users.map(u => ({
  ...u,
  label: u.active ? "Active" : "Inactive"
}));`}</code></pre>

          <h3>filter() â€” keep elements matching a condition</h3>
          <pre><code>{`const activeUsers = users.filter(u => u.active);
// [{ id: 1, name: "Alice", active: true }]

// Chaining with map
const activeNames = users
  .filter(u => u.active)
  .map(u => u.name);
// ["Alice"]`}</code></pre>

          <h3>reduce() â€” fold array into a single value</h3>
          <pre><code>{`const orders = [
  { product: "A", amount: 120 },
  { product: "B", amount: 80 },
  { product: "C", amount: 200 },
];

// Sum amounts
const total = orders.reduce((sum, order) => sum + order.amount, 0);
// 400

// Group by a key
const byProduct = orders.reduce((acc, order) => {
  acc[order.product] = order.amount;
  return acc;
}, {});
// { A: 120, B: 80, C: 200 }`}</code></pre>

          <h3>flat() and flatMap()</h3>
          <pre><code>{`// flat() â€” flatten nested arrays
const nested = [[1, 2], [3, 4], [5]];
nested.flat();       // [1, 2, 3, 4, 5]
nested.flat(Infinity); // works for any depth

// flatMap() â€” map then flat(1) in one step
const sentences = ["hello world", "foo bar"];
const words = sentences.flatMap(s => s.split(" "));
// ["hello", "world", "foo", "bar"]`}</code></pre>

          <h2>Search methods (find elements)</h2>

          <h3>find() and findIndex()</h3>
          <pre><code>{`const user = users.find(u => u.id === 2);
// { id: 2, name: "Bob", active: false }

const index = users.findIndex(u => u.id === 2);
// 1

// Returns undefined / -1 if not found
users.find(u => u.id === 99);      // undefined
users.findIndex(u => u.id === 99); // -1`}</code></pre>

          <h3>some() and every()</h3>
          <pre><code>{`// some() â€” does at least one match?
users.some(u => u.active);  // true (Alice is active)
users.some(u => u.id > 10); // false

// every() â€” do all match?
users.every(u => u.active); // false (Bob is not active)
users.every(u => u.id > 0); // true`}</code></pre>

          <h3>includes() vs indexOf()</h3>
          <pre><code>{`const nums = [1, 2, 3, NaN];

nums.includes(2);    // true
nums.includes(NaN);  // true â€” handles NaN correctly

nums.indexOf(2);     // 1
nums.indexOf(NaN);   // -1 â€” NaN !== NaN in indexOf`}</code></pre>

          <h2>Mutation methods (modify in place)</h2>

          <h3>push, pop, shift, unshift, splice</h3>
          <pre><code>{`const arr = [1, 2, 3];

arr.push(4);        // adds to end â†’ [1, 2, 3, 4]
arr.pop();          // removes from end â†’ [1, 2, 3]
arr.unshift(0);     // adds to start â†’ [0, 1, 2, 3]
arr.shift();        // removes from start â†’ [1, 2, 3]

// splice(startIndex, deleteCount, ...itemsToInsert)
arr.splice(1, 0, 99);   // insert 99 at index 1 â†’ [1, 99, 2, 3]
arr.splice(1, 1);        // remove 1 element at index 1 â†’ [1, 2, 3]`}</code></pre>
          <p>
            These mutate the original array. If you need to avoid mutation (React state, for example), use spread or slice instead:
          </p>
          <pre><code>{`// Immutable push equivalent
const newArr = [...arr, 4];

// Immutable splice equivalent (remove at index i)
const withoutI = [...arr.slice(0, i), ...arr.slice(i + 1)];`}</code></pre>

          <h2>Sorting and ordering</h2>

          <h3>sort()</h3>
          <pre><code>{`// Default sort converts to strings â€” WRONG for numbers
[10, 2, 100].sort(); // [10, 100, 2] â† string order

// Correct numeric sort
[10, 2, 100].sort((a, b) => a - b); // [2, 10, 100]

// Sort objects by property
users.sort((a, b) => a.name.localeCompare(b.name));`}</code></pre>
          <p>
            <strong>Warning:</strong> <code>sort()</code> mutates the array in place. Use <code>[...arr].sort(...)</code> for an immutable sort.
          </p>

          <h3>reverse()</h3>
          <pre><code>{`[1, 2, 3].reverse(); // [3, 2, 1] â€” mutates in place

// Immutable reverse
const reversed = [...arr].reverse();
// Or in modern JS:
arr.toReversed(); // Returns new array (Chrome 110+, Node 20+)`}</code></pre>

          <h2>Utility methods</h2>

          <h3>Array.from() â€” create arrays from iterables</h3>
          <pre><code>{`// From NodeList (DOM)
const divs = Array.from(document.querySelectorAll('div'));

// From string
Array.from("hello"); // ["h", "e", "l", "l", "o"]

// Create an array of n items
Array.from({ length: 5 }, (_, i) => i); // [0, 1, 2, 3, 4]`}</code></pre>

          <h3>Array.isArray()</h3>
          <pre><code>{`// typeof returns "object" for arrays â€” use this instead
Array.isArray([]);         // true
Array.isArray({});         // false
Array.isArray("hello");   // false`}</code></pre>

          <h2>The immutable counterparts (ES2023)</h2>
          <p>
            ES2023 added immutable versions of mutating methods â€” they return a new array instead of modifying the original:
          </p>
          <pre><code>{`arr.toSorted((a, b) => a - b)  // vs sort() â€” non-mutating
arr.toReversed()                // vs reverse() â€” non-mutating
arr.toSpliced(1, 1)             // vs splice() â€” non-mutating
arr.with(2, 99)                 // replace element at index 2 with 99`}</code></pre>
          <p>
            Supported in Chrome 110+, Firefox 115+, Safari 16+, Node 20+.
          </p>

          <h2>Related tools</h2>
          <ul>
            <li><Link href="/tools/js-minifier">Free JavaScript Minifier</Link> â€” minify your JavaScript arrays and logic before production</li>
            <li><Link href="/tools/json-formatter">Free JSON Formatter</Link> â€” format JSON arrays for debugging</li>
          </ul>

          <hr className="my-8" />
          <p className="text-sm text-gray-400">
            Written by <Link href="/about" className="text-black/60 dark:text-white/60 underline underline-offset-2 hover:text-black">Achraf A.</Link>, founder of TheFreeAITools.
          </p>
        </div>
      </article>
    </main>
  )
}

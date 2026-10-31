# Maritama Solar Tech

Static website. Serve this directory with `python3 -m http.server 8000 --bind 127.0.0.1` and open `index-2-dark.html`. No build or runtime package installation is required.

- `index.html` and the alternate home templates redirect to `index-2-dark.html`.
- `solutions.html` replaces the public Services navigation. Old service URLs redirect there.
- `products.html` searches and filters the eight existing product families. `assets/js/catalog.js` contains their descriptive data; specific models, prices and warranties require approved information.
- `products-details.html?product=solar-panels` is an example detail URL. The singular `product-details.html` redirects while preserving query parameters.
- `cart.html` stores an enquiry selection in browser localStorage; it is not a payment checkout or stock reservation system.
- The Contact form prepares an email addressed to `contact@maritamatrading.com`. The customer must open an email application or copy the text and send it. No delivery or order acceptance is implied.
- Shared styles and interactions are in `assets/css/maritama.css` and `assets/js/maritama.js`. Shared header/footer markup is repeated in the static HTML, so update each primary page consistently.

The supplied checkout had no assets directory. The current design uses shared responsive CSS and text branding, without photographs or the original graphical logo. Restore approved images before treating visual branding and product imagery as complete. Original template snapshots remain in Git history.

## Verification

The review used the environment's installed Node.js, Playwright and `/usr/bin/chromium`. With the local server running, execute from this directory:

```sh
node tests/site-review.cjs
node tests/final-review.cjs
```

The scripts require Playwright to be resolvable in Node and Chromium at the path above. They do not send emails or place orders. The first suite checks every HTML route, including redirects, at four viewport widths and exercises navigation, local resources, search, filters, cart and contact flows. The final suite captures primary pages at three viewport sizes, checks all eight product order handoffs and exercises the final fixes. Screenshots and current results are written to `/tmp/maritama-review`.

See `docs/website-review.md` for outcomes and remaining requirements.

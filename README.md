# FastenerTools

🌐 **Live: https://diankuanghuolong.github.io/fastener-tools/**

Free, no-signup fastener reference tools for engineers, machinists and buyers: a bolt torque calculator, dimension charts, thread & tap drill tables, a DIN/ISO/GB standards cross-reference and a unit converter. Everything runs in your browser — no accounts, no tracking, no dependencies.

## Tools

| Page | What it does |
| --- | --- |
| [Bolt Torque Calculator](bolt-torque-calculator.html) | Tightening torque T = K·F·d for M4–M24, property classes 4.8–12.9, dry / oiled / lubricated conditions |
| [Bolt Size Chart](bolt-size-chart.html) | Metric hex head dimensions M4–M24 (across flats, head height, pitch, stress area) + UNC inch sizes |
| [Thread Pitch & Tap Drill Chart](thread-pitch-table.html) | Coarse & fine pitches with tap drill sizes, plus UNC/UNF |
| [Standards Cross-Reference](standards-cross-reference.html) | DIN ↔ ISO ↔ GB equivalents and ISO 898-1 property class properties |
| [Unit Converter](unit-converter.html) | mm ↔ inch with 1/64" fractions and M-to-UNC bolt substitutions |
| [Request a Quote](contact.html) | Supply inquiries for fasteners in volume |

## Run locally

```bash
python3 -m http.server 8099
# open http://127.0.0.1:8099
```

## Deploy your own copy

This is a plain static site — no build step. Fork or copy it, then either:

- **GitHub Pages**: push to a repo → Settings → Pages → Deploy from a branch → `main` / `(root)`
- **Cloudflare Pages / Netlify**: upload the folder, done

Remember to replace the domain in `sitemap.xml` and `robots.txt` with your own URL.

## Data sources

Compiled from ISO 898-1 (property classes, stress areas), ISO 261 / ISO 6892 / ASME B1.1 (threads), ISO 4017 / ISO 4014 / ASME B18.2.1 (dimensions) and GB/T standards.

> ⚠️ Charts are provided **for reference only** and do not constitute engineering advice. Verify against the official standard edition before contractual or safety-critical use.

## License

Free to use and fork.

# HAN Anlagenbau – Designentwurf Startseite

Statischer Entwurf ohne Framework und ohne Buildsystem. Zum Ansehen `index.html` direkt im Browser öffnen.

## Struktur

| Datei / Ordner | Inhalt |
| --- | --- |
| `index.html` | Gesamte Startseite: Header, Hero-Slider, Leistungen, Unternehmen, Kontakt, Footer |
| `css/style.css` | Gestaltung; Farben und Abstände als CSS-Variablen in `:root` |
| `js/main.js` | Navigation, Slider, Formularprüfung, Kartenfreigabe, Scroll-Einblendung |
| `images/` | Slider-Bilder (aktuell SVG-Platzhalter) |

## Inhalte pflegen

- **Texte:** direkt in `index.html` ändern. Jede Folie des Sliders ist ein `<article class="hero__slide">`.
- **Kontaktdaten:** im Abschnitt `#kontakt` und im Footer; Telefonnummern als `tel:`-Links ohne Leerzeichen.
- **Farben:** in `css/style.css` unter `:root`. Der Blauton (`--color-accent`, `--color-accent-hover`, `--color-accent-light`) ist vorläufig und wird durch den offiziellen HAN-Farbwert ersetzt.
- **Schrift:** Lato über Adobe Fonts (Typekit-Kit `jyo4txf` in `index.html`). Der Kit muss im Adobe-Fonts-Konto für die spätere Live-Domain freigegeben sein; Fallback ist ein Systemschrift-Stack. Hinweis für die Datenschutzerklärung: Beim Laden wird eine Verbindung zu `use.typekit.net` (Adobe) aufgebaut.

## Slider-Bilder austauschen

1. Fotos als JPG/WebP in `images/` ablegen, Querformat, empfohlen 1920 × 1080 px (Dateigröße möglichst unter 400 KB).
2. In `index.html` die `src`-Attribute der `<img class="hero__image">` anpassen und `width`/`height` auf die tatsächlichen Maße setzen.
3. Bildausschnitt bei Bedarf per `object-position` in `.hero__image` feinjustieren.
4. Neue Folie: `<article class="hero__slide">` kopieren, `id` und `aria-label` anpassen, einen weiteren Punkt in `.hero__dots` mit passendem `aria-controls` ergänzen.

Die aktuellen SVG-Dateien sind neutrale Platzhalter und zeigen keine realen HAN-Anlagen.

## Noch offen vor einer Veröffentlichung

- **Kontaktformular:** prüft nur Eingaben und versendet nichts. Für den Live-Betrieb ist ein Versandweg nötig (z. B. PHP-Mailer auf dem Hosting oder ein Formulardienst) inklusive Spam-Schutz.
- **Datenschutz / Impressum:** Der Footer verweist auf die bestehende Seite han.at. Die Datenschutzerklärung muss für Google Maps (Laden erst nach Klick) und den Formularversand angepasst werden.
- **Logo:** Statt der Text-Wortmarke (`.brand`) das offizielle Logo als SVG einsetzen.
- **Weitere Seiten:** Entwurf umfasst nur die Startseite.

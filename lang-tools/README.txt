LANGUAGE TOOLS (drop this whole "lang-tools" folder into the almanac repo, next to languages.html)

Open lang-tools/index.html to start. Everything uses relative links, so it works from any folder on GitHub Pages and also when opened straight from your computer.

lang-tools/
  index.html            language picker
  assets/               shared header and colours (shell.css, shell.js)
  nok/
    index.html          Nok home
    sounds/             Sound Cards (sounds-data.js holds every sound; sounds.js is the page)
    flashcards/         Flashcards (decks.js holds the decks)
    audio/              reference recordings, plus manifest.js

REFERENCE RECORDINGS
Put an mp3 in nok/audio/ named after the sound id (b.mp3, zh.mp3, v-in.mp3, d-ai.mp3 ...).
To use a different recording for one dialect only, add the dialect letter: r-t.mp3 means the Taucumu card of r.
Dialect letters: z Zaukumu, t Taucumu, n Nasibumu, r Ranakumung.
Then add the file name (without .mp3) to the list in audio/manifest.js.
A site recording plays before the Wikimedia Commons file.

ADDING ANOTHER LANGUAGE
Make lang-tools/<name>/ with its own tool folders, then add one entry to LANGS in assets/shell.js and one tile in lang-tools/index.html. Link the new language from its almanac page, as lang-nok.html does for Nok.

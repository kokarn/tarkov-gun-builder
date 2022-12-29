# Tarkov Gun Builder

## To build & deploy:

    npm run publish:npm

## To update data

    Update items-from-tarkov-dev-api.json
    Update latest-dump-from-bsg.json
    node src/merger.js
    Move /items.json to src/items.json

Test it out with npm run start, then

    Move items.json, items_preset.json and globals.json to the folder where you want to use the widget

## New ammos have been added and you need presets?

    Check how 633ec7c2a6918cb895019c6c is used in items_preset.json and globals.json

## License

```
ISC License

Copyright (c) 2022 Nicola Genesin & Oskar Risberg

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```

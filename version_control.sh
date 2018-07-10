prevversion=v1
version=v2
for file in js/*.$prevversion.js; do mv "$file" "${file%.$prevversion.js}.$version.js"; done
for file in css/*.$prevversion.css; do mv "$file" "${file%.$prevversion.css}.$version.css"; done
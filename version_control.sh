version=v1
for file in js/*.js; do mv "$file" "${file%.js}.$version.js"; done
for file in css/*.css; do mv "$file" "${file%.css}.$version.css"; done
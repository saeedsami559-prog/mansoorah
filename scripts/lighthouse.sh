#!/usr/bin/env bash
# Mobile Lighthouse on key pages (needs `npm run preview` running). Reports → docs/lighthouse/
set -e
CHROME_PATH=${CHROME_PATH:-$(ls -d /opt/pw-browsers/chromium-*/chrome-linux*/chrome 2>/dev/null | head -1)}
export CHROME_PATH
BASE=${BASE:-http://localhost:4173/mansoorah}
for p in "home:/" "services:/services/" "service-detail:/services/smart-door-lock/" "booking:/book/smart-door-lock"; do
  name=${p%%:*}; path=${p#*:}
  npx lighthouse "$BASE$path" --quiet --chrome-flags="--headless=new --no-sandbox" --form-factor=mobile \
    --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="docs/lighthouse/$name.json" >/dev/null 2>&1
  node -e "const r=require('./docs/lighthouse/$name.json');const c=r.categories;console.log('$name'.padEnd(16),Object.values(c).map(x=>x.title.split(' ')[0]+' '+Math.round(x.score*100)).join('  '))"
done

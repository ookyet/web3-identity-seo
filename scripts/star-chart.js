#!/usr/bin/env node
// star-chart.js — regenerate the static star-history SVGs embedded in README.md.
//
// Self-hosted replacement for third-party chart services (star-history.com and
// starchart.cc could not read this repo's starred-data timeline). Run manually
// during port windows — never from CI or any bot:
//
//   node scripts/star-chart.js
//
// Requires an authenticated `gh` CLI. Writes:
//   docs/assets/star-history-light.svg
//   docs/assets/star-history-dark.svg

'use strict';

const { execFileSync } = require('node:child_process');
const { writeFileSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');

const REPO = 'ookyet/web3-identity-seo';
const OUT_DIR = join(__dirname, '..', 'docs', 'assets');

const THEMES = {
  light: { line: '#2a78d6', ink: '#57606a', grid: '#d8dee4' },
  dark: { line: '#3987e5', ink: '#8b949e', grid: '#30363d' },
};

function fetchStarDates() {
  const out = execFileSync(
    'gh',
    [
      'api',
      '-H', 'Accept: application/vnd.github.star+json',
      `repos/${REPO}/stargazers?per_page=100`,
      '--paginate',
      '--jq', '.[].starred_at',
    ],
    { encoding: 'utf8' },
  );
  return out
    .split('\n')
    .filter(Boolean)
    .map((s) => new Date(s).getTime())
    .sort((a, b) => a - b);
}

function niceCeil(n) {
  const step = n <= 100 ? 25 : n <= 500 ? 50 : 100;
  return Math.ceil(n / step) * step;
}

function monthTicks(t0, t1) {
  const ticks = [];
  const d = new Date(t0);
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + 1);
  while (d.getTime() < t1) {
    ticks.push(d.getTime());
    d.setUTCMonth(d.getUTCMonth() + 1);
  }
  // Keep at most ~6 labels: thin evenly.
  const keep = Math.max(1, Math.round(ticks.length / 5));
  return ticks.filter((_, i) => i % keep === 0);
}

function fmtMonth(t) {
  const d = new Date(t);
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${names[d.getUTCMonth()]} ${String(d.getUTCFullYear()).slice(2)}`;
}

function buildSvg(dates, theme) {
  const { line, ink, grid } = theme;
  const W = 800; const H = 320;
  const M = { top: 28, right: 60, bottom: 34, left: 46 };
  const iw = W - M.left - M.right;
  const ih = H - M.top - M.bottom;

  const t0 = dates[0];
  const t1 = Date.now();
  const total = dates.length;
  const yMax = niceCeil(total);

  const x = (t) => M.left + ((t - t0) / (t1 - t0)) * iw;
  const y = (v) => M.top + ih - (v / yMax) * ih;

  // Step-after path through each star event, extended to "now".
  let d = `M ${x(t0).toFixed(1)} ${y(0).toFixed(1)}`;
  dates.forEach((t, i) => {
    d += ` L ${x(t).toFixed(1)} ${y(i).toFixed(1)} L ${x(t).toFixed(1)} ${y(i + 1).toFixed(1)}`;
  });
  d += ` L ${x(t1).toFixed(1)} ${y(total).toFixed(1)}`;

  const yTicks = [];
  const yStep = yMax <= 100 ? 25 : yMax <= 500 ? 50 : 100;
  for (let v = 0; v <= yMax; v += yStep) yTicks.push(v);

  const font = 'ui-sans-serif, system-ui, -apple-system, sans-serif';
  const gridLines = yTicks
    .map((v) => `<line x1="${M.left}" y1="${y(v).toFixed(1)}" x2="${M.left + iw}" y2="${y(v).toFixed(1)}" stroke="${grid}" stroke-width="1"/>`)
    .join('\n  ');
  const yLabels = yTicks
    .map((v) => `<text x="${M.left - 8}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end" fill="${ink}" font-size="11" font-family="${font}">${v}</text>`)
    .join('\n  ');
  const xLabels = monthTicks(t0, t1)
    .map((t) => `<text x="${x(t).toFixed(1)}" y="${M.top + ih + 20}" text-anchor="middle" fill="${ink}" font-size="11" font-family="${font}">${fmtMonth(t)}</text>`)
    .join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Cumulative GitHub stars for ${REPO}: ${total} as of ${new Date().toISOString().slice(0, 10)}">
  <text x="${M.left}" y="16" fill="${ink}" font-size="12" font-family="${font}">GitHub stars, cumulative — ${REPO}</text>
  ${gridLines}
  ${yLabels}
  ${xLabels}
  <path d="${d}" fill="none" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="${x(t1).toFixed(1)}" cy="${y(total).toFixed(1)}" r="4" fill="${line}"/>
  <text x="${(x(t1) + 8).toFixed(1)}" y="${(y(total) + 4).toFixed(1)}" fill="${ink}" font-size="12" font-weight="600" font-family="${font}">${total}</text>
</svg>
`;
}

const dates = fetchStarDates();
mkdirSync(OUT_DIR, { recursive: true });
for (const [name, theme] of Object.entries(THEMES)) {
  const file = join(OUT_DIR, `star-history-${name}.svg`);
  writeFileSync(file, buildSvg(dates, theme));
  console.log(`wrote ${file} (${dates.length} stars)`);
}

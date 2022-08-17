import Fastify from "fastify";
import puppeteer from "puppeteer";

// Chromium
const browser = await puppeteer.launch({
  args: [
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
  ],
  headless: true,
})

const page = await browser.newPage();

page.setDefaultTimeout(0);
page.setDefaultNavigationTimeout(0);


const server = Fastify({ logger: false });

async function createRespond(params, reply) {
  
  const { html = '', w, h, s, q, t } = params;

  const width = parseInt(w) || 512;
  const height = parseInt(h) || 512;
  const scale = parseFloat(s) || 1;
  const type = ['png', 'jpeg', 'webp'].includes(t) ? t : 'jpeg';;
  
  let quality;

  if (type != 'png') {
    quality = parseFloat(q) || 98
    quality = Math.min(Math.max(quality, 0), 100);
  }

  page.setViewport({
    width: Math.round(width / scale),
    height: Math.floor(height / scale),
    deviceScaleFactor: scale
  });

  page.setContent(html)

  const buffer = await page.screenshot({ type, quality });
  reply.type(`image/${type}`);
  return buffer;
}

server.get('/render', async (request, reply) => createRespond(request.query, reply));
server.post('/render', async (request, reply) => createRespond(request.body, reply));

await server.listen({
  port: 8080,
  host: '::'
})

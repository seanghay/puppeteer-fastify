import puppeteer from "puppeteer";

// Chromium
const browser = await puppeteer.launch({
  args: [
    '--in-process-gpu',
    '--disable-speech-api',
    '--single-process',
    '--enable-features=SharedArrayBuffer',
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
    '--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process',
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
    '--no-sandbox', 
    '--no-zygote',
    '--disable-setuid-sandbox'
  ],
  headless: true,
})

const page = await browser.newPage();

page.setDefaultTimeout(0);
page.setDefaultNavigationTimeout(0);


export async function createResponse(params, reply) {

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

  const concatHtml =  `<p>${html}</p>`
  page.setContent(concatHtml)

  const buffer = await page.screenshot({ type, quality });
  reply.type(`image/${type}`);
  return buffer;
}
const { chromium, devices } = require('playwright');

const URL = "https://ysyglobaloffers.netlify.app";

const profiles = [
  {
    name: "Desktop-1",
    config: {
      viewport: { width: 1440, height: 900 },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
  },
  {
    name: "Desktop-2",
    config: {
      viewport: { width: 1366, height: 768 },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
  },
  {
    name: "Mobile-1",
    config: devices['iPhone 12']
  },
  {
    name: "Mobile-2",
    config: devices['Pixel 5']
  }
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function simulateUser(profile) {
  let browser;

  try {
    browser = await chromium.launch();
    const context = await browser.newContext(profile.config);
    const page = await context.newPage();

    console.log(`▶ Usuario: ${profile.name}`);

    await page.goto(URL, { waitUntil: "domcontentloaded" });

    // tiempo dentro de la página (30–90 segundos)
    await sleep(30000 + Math.random() * 60000);

    // scroll natural
    await page.mouse.wheel(0, 800);
    await sleep(2000);

    await page.mouse.wheel(0, 1200);
    await sleep(2000);

    await page.mouse.wheel(0, 600);
    await sleep(1000);

    // interacción ligera
    try {
      await page.click("body", { timeout: 3000 });
    } catch {}

    await sleep(2000);

    console.log(`✔ Finalizado: ${profile.name}`);

  } catch (err) {
    console.log(`❌ Error en ${profile.name}:`, err.message);
  } finally {
    if (browser) await browser.close();
  }
}

async function runCycle() {
  console.log("\n===== CYCLE START =====\n");

  for (let i = 0; i < profiles.length; i++) {
    await simulateUser(profiles[i]);

    // pausa entre usuarios (5–7 minutos)
    if (i < profiles.length - 1) {
      const pause = (5 + Math.random() * 2) * 60 * 1000;
      console.log(`⏳ Espera ${(pause / 60000).toFixed(1)} min`);
      await sleep(pause);
    }
  }

  console.log("\n===== CYCLE COMPLETE =====");
}

runCycle();

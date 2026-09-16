import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";

// playwright может быть установлен как локально, так и глобально —
// резолвим через require, чтобы работало в обоих случаях
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const BASE_URL = process.env.CHECK_URL || "http://127.0.0.1:8765/index.html";
const SHOTS = process.argv.includes("--shots");
const SHOTS_DIR = new URL("./shots/", import.meta.url).pathname;

const VIEWPORTS = [
	{ name: "4k-3840", width: 3840, height: 1200 },
	{ name: "desktop-1920", width: 1920, height: 1080 },
	{ name: "laptop-1440", width: 1440, height: 900 },
	{ name: "laptop-1280", width: 1280, height: 800 },
	{ name: "bp-1024", width: 1024, height: 800 },
	{ name: "tablet-900", width: 900, height: 1000 },
	{ name: "tablet-768", width: 768, height: 1024 },
	{ name: "phone-640", width: 640, height: 900 },
	{ name: "phone-390", width: 390, height: 844 },
	{ name: "phone-375", width: 375, height: 667 },
	{ name: "phone-360", width: 360, height: 800 },
	{ name: "phone-320", width: 320, height: 568 },
];

if (SHOTS) {
	mkdirSync(SHOTS_DIR, { recursive: true });
}

const browser = await chromium.launch({
	executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium",
});

let failures = 0;

for (const vp of VIEWPORTS) {
	const page = await browser.newPage({
		viewport: { width: vp.width, height: vp.height },
	});

	const consoleErrors = [];
	const missing = [];

	page.on("console", (msg) => {
		if (msg.type() === "error") consoleErrors.push(msg.text());
	});
	page.on("pageerror", (err) =>
		consoleErrors.push("PAGEERROR: " + err.message),
	);
	page.on("response", (res) => {
		if (res.status() >= 400) missing.push(res.status() + " " + res.url());
	});

	await page.goto(BASE_URL, { waitUntil: "load" });
	await page.waitForTimeout(600);

	const metrics = await page.evaluate(() => {
		const doc = document.documentElement;
		return {
			scrollWidth: doc.scrollWidth,
			clientWidth: doc.clientWidth,
			overflowPx: doc.scrollWidth - doc.clientWidth,
		};
	});

	const hasOverflow = metrics.overflowPx > 1;
	if (hasOverflow) failures++;

	const status = hasOverflow ? "ПЕРЕПОЛНЕНИЕ" : "ок";
	console.log(
		`${vp.name.padEnd(14)} ${status.padEnd(14)} overflow=${metrics.overflowPx}px` +
			(consoleErrors.length
				? `  ошибок в консоли: ${consoleErrors.length}`
				: "") +
			(missing.length ? `  битых запросов: ${missing.length}` : ""),
	);

	if (SHOTS) {
		await page.screenshot({
			path: `${SHOTS_DIR}${vp.name}.png`,
			fullPage: true,
		});
	}

	await page.close();
}

await browser.close();

console.log("");
console.log(
	failures === 0
		? "Горизонтальной прокрутки нет ни на одной ширине."
		: `Проблемы на ${failures} ширинах.`,
);
process.exit(failures === 0 ? 0 : 1);

import { generateReceiptHTML } from "./receipt-generator"

interface ReceiptData {
	bookingId: string
	date: string
	time: string
	customerName: string
	phone: string
	serviceName: string
	servicePrice: number
	paymentMethod: string
	status: string
	locale?: string
	currency?: string
}

export async function generateReceiptPDF(data: ReceiptData): Promise<Buffer> {
	const html = generateReceiptHTML(data)

	// Dynamic import to handle both local and production environments
	const isVercel = process.env.VERCEL === "1"

	let browser
	try {
		if (isVercel) {
			// Use @sparticuz/chromium for Vercel/serverless
			const chromium = await import("@sparticuz/chromium")
			const puppeteer = await import("puppeteer-core")

			// Get executable path - handle different API versions
			let executablePath: string | undefined
			if (chromium && typeof chromium === "object") {
				if (typeof (chromium as any).executablePath === "function") {
					executablePath = await (chromium as any).executablePath()
				} else if (typeof (chromium as any).executablePath === "string") {
					executablePath = (chromium as any).executablePath
				}
			}

			browser = await puppeteer.default.launch({
				args: [
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--disable-dev-shm-usage",
					"--disable-gpu",
				],
				defaultViewport: { width: 1920, height: 1080 },
				executablePath,
			})
		} else {
			// Local development - use puppeteer-core with system Chrome/Chromium
			// If that fails, it will fall back to using @sparticuz/chromium
			try {
				const puppeteer = await import("puppeteer-core")
				// Try to find Chrome/Chromium in common locations
				const executablePaths = [
					process.env.PUPPETEER_EXECUTABLE_PATH,
					"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
					"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
					"/usr/bin/google-chrome",
					"/usr/bin/chromium",
					"/usr/bin/chromium-browser",
				].filter(Boolean) as string[]

				let executablePath: string | undefined
				const fs = await import("fs/promises")
				for (const path of executablePaths) {
					try {
						await fs.access(path)
						executablePath = path
						break
					} catch {
						// Continue to next path
					}
				}

				browser = await puppeteer.default.launch({
					headless: true,
					executablePath,
					args: ["--no-sandbox", "--disable-setuid-sandbox"],
				})
			} catch {
				// Fallback to @sparticuz/chromium for local dev
				const chromium = await import("@sparticuz/chromium")
				const puppeteer = await import("puppeteer-core")

				// Get executable path - handle different API versions
				let executablePath: string | undefined
				if (chromium && typeof chromium === "object") {
					if (typeof (chromium as any).executablePath === "function") {
						executablePath = await (chromium as any).executablePath()
					} else if (typeof (chromium as any).executablePath === "string") {
						executablePath = (chromium as any).executablePath
					}
				}

				browser = await puppeteer.default.launch({
					args: [
						"--no-sandbox",
						"--disable-setuid-sandbox",
						"--disable-dev-shm-usage",
						"--disable-gpu",
					],
					defaultViewport: { width: 1920, height: 1080 },
					executablePath,
				})
			}
		}

		const page = await browser.newPage()
		await page.setContent(html, { waitUntil: "networkidle0" })
		const pdfBuffer = await page.pdf({
			format: "A4",
			printBackground: true,
		})

		return Buffer.from(pdfBuffer)
	} catch (error) {
		console.error("Error generating PDF:", error)
		throw error
	} finally {
		if (browser) {
			await browser.close()
		}
	}
}
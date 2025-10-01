// scripts/generate-readme-ts.js
const fs = require('fs')
const path = require('path')

const readmePath = path.join(__dirname, '../README.md')
const outPath = path.join(__dirname, '../components/readme-content.ts')

const readmeRaw = fs.readFileSync(readmePath, 'utf8')

// --- HTML table to Markdown table conversion ---
function htmlTableToMarkdown(html) {
	// Only supports simple <table><thead><tr><th>... and <tbody><tr><td>...
	// Not a full HTML parser, but works for most README tables
	return html.replace(
		/<table>[\s\S]*?<thead>([\s\S]*?)<\/thead>[\s\S]*?<tbody>([\s\S]*?)<\/tbody>[\s\S]*?<\/table>/gi,
		(match, thead, tbody) => {
			// Parse headers
			const headerRow = /<tr>([\s\S]*?)<\/tr>/i.exec(thead)
			const headers = headerRow
				? Array.from(headerRow[1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)).map(
						(m) => m[1].trim().replace(/\n/g, ' '),
					)
				: []
			// Parse body rows
			const bodyRows = Array.from(tbody.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)).map(
				(rowMatch) => {
					return Array.from(
						rowMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi),
					).map((m) => m[1].trim().replace(/\n/g, ' '))
				},
			)
			// Build markdown
			let md = '| ' + headers.join(' | ') + ' |\n'
			md += '| ' + headers.map(() => '---').join(' | ') + ' |\n'
			for (const row of bodyRows) {
				md += '| ' + row.join(' | ') + ' |\n'
			}
			return md
		},
	)
}

const readme = htmlTableToMarkdown(readmeRaw)
const out = `// Auto-generated from README.md\nexport default ${JSON.stringify(readme)};\n`

fs.writeFileSync(outPath, out, 'utf8')
console.log(`Wrote ${outPath}`)

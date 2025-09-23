#!/usr/bin/env node
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

function usage() {
  console.log('\nUsage: node scripts/upload-apk.js --apk ./android/app/build/outputs/apk/release/app-release.apk --tag v1.2.3 [--owner Owner] [--repo repo] [--token GITHUB_TOKEN]')
  console.log('\nEnvironment: You can set GITHUB_TOKEN env var instead of --token')
  process.exit(1)
}

function run(cmd) {
  try {
    return execSync(cmd, { stdio: ['pipe', 'pipe', 'inherit'] }).toString()
  } catch (e) {
    if (e.stdout) return e.stdout.toString()
    throw e
  }
}

function parseArgs() {
  const args = process.argv.slice(2)
  const out = {}
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a.startsWith('--')) {
      const key = a.replace(/^--/, '')
      const val = args[i+1] && !args[i+1].startsWith('--') ? args[++i] : true
      out[key] = val
    }
  }
  return out
}

async function main() {
  const argv = parseArgs()
  const apkPath = argv.apk
  const tag = argv.tag
  const owner = argv.owner || 'VirtualizeLLC'
  const repo = argv.repo || 'dive-safe'
  const token = argv.token || process.env.GITHUB_TOKEN

  if (!apkPath || !tag) usage()
  if (!token) {
    console.error('Missing GitHub token. Pass --token or set GITHUB_TOKEN env var.')
    process.exit(2)
  }

  const absoluteApk = path.resolve(apkPath)
  if (!fs.existsSync(absoluteApk)) {
    console.error('APK not found at', absoluteApk)
    process.exit(2)
  }

  const filename = path.basename(absoluteApk)

  console.log(`Using owner=${owner} repo=${repo} tag=${tag} file=${absoluteApk}`)

  // 1) Try to get release by tag
  let release
  try {
    const out = run(`curl -s -H "Authorization: token ${token}" https://api.github.com/repos/${owner}/${repo}/releases/tags/${encodeURIComponent(tag)}`)
    release = JSON.parse(out)
    if (release && release.message === 'Not Found') release = null
  } catch (e) {
    release = null
  }

  // 2) Create release if not found
  if (!release) {
    console.log('Release not found — creating release', tag)
    const data = JSON.stringify({ tag_name: tag, name: tag, draft: false, prerelease: false })
    const out = run(`curl -s -X POST -H "Authorization: token ${token}" -H "Content-Type: application/json" -d '${data}' https://api.github.com/repos/${owner}/${repo}/releases`)
    release = JSON.parse(out)
  }

  if (!release || !release.id) {
    console.error('Failed to find or create release. Response:', release)
    process.exit(3)
  }

  const releaseId = release.id
  const uploadUrlTemplate = release.upload_url || release.upload_url_template || null

  // 3) If an asset with same name exists, delete it
  try {
    const assetsOut = run(`curl -s -H "Authorization: token ${token}" https://api.github.com/repos/${owner}/${repo}/releases/${releaseId}/assets`)
    const assets = JSON.parse(assetsOut)
    if (Array.isArray(assets)) {
      const existing = assets.find(a => a.name === filename)
      if (existing) {
        console.log('Found existing asset with same name; deleting asset id', existing.id)
        run(`curl -s -X DELETE -H "Authorization: token ${token}" https://api.github.com/repos/${owner}/${repo}/releases/assets/${existing.id}`)
      }
    }
  } catch (e) {
    // ignore
  }

  // 4) Upload asset
  const uploadBase = (uploadUrlTemplate && uploadUrlTemplate.split('{')[0]) || `https://uploads.github.com/repos/${owner}/${repo}/releases/${releaseId}/assets`
  const uploadUrl = `${uploadBase}?name=${encodeURIComponent(filename)}`

  console.log('Uploading', filename, 'to release', releaseId)
  // Use curl --data-binary to stream the file
  const contentType = 'application/vnd.android.package-archive'
  try {
    // use -sS to show errors
    run(`curl -sS -X POST -H "Authorization: token ${token}" -H "Content-Type: ${contentType}" --data-binary @${absoluteApk} "${uploadUrl}"`)
    console.log('Upload complete')
  } catch (e) {
    console.error('Upload failed:', e.message || e)
    process.exit(4)
  }
}

main().catch(err => { console.error(err); process.exit(1) })

#!/usr/bin/env node
const { spawn } = require('child_process')
const { readFileSync } = require('fs')
const { resolve, join } = require('path')

function loadEnv(envPath) {
  const content = readFileSync(envPath, { encoding: 'utf8' })
  const lines = content.split(/\r?\n/)
  const env = {}

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const equalIndex = trimmed.indexOf('=')
    if (equalIndex === -1) continue
    const key = trimmed.slice(0, equalIndex)
    let value = trimmed.slice(equalIndex + 1)
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }

  return env
}

function main() {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.error('Usage: node run-with-env.js <subfolder> <command> [args...]')
    process.exit(2)
  }

  const subfolder = args[0]
  const cmd = args[1]
  const cmdArgs = args.slice(2)

  const repoRoot = process.cwd()
  const envPath = resolve(repoRoot, 'example.env')
  let env = {}
  try {
    env = loadEnv(envPath)
  } catch (err) {
    console.warn('Could not read example.env, proceeding with current environment')
  }

  const childEnv = Object.assign({}, process.env, env)

  const childCwd = join(repoRoot, subfolder)

  const child = spawn(cmd, cmdArgs, {
    cwd: childCwd,
    env: childEnv,
    stdio: 'inherit',
    shell: true,
  })

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal)
    } else {
      process.exit(code)
    }
  })
}

main()

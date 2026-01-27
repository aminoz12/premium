# Netlify Build Fix - Exit Code 127

## Problem
Netlify build fails with exit code 127: "npm not found"

## Root Cause
Exit code 127 means the command (`npm`) is not found. This happens when Node.js is not installed or activated in the build environment.

## Solution Steps

### Step 1: Set Node.js Version in Netlify UI
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Build & deploy** → **Environment**
3. Click **Add variable**
4. Add:
   - **Key**: `NODE_VERSION`
   - **Value**: `18`
5. Save

### Step 2: Clear Build Cache
1. Go to **Site settings** → **Build & deploy**
2. Scroll to **Build settings**
3. Click **Clear cache and retry deploy**

### Step 3: Verify Build Settings
1. Go to **Site settings** → **Build & deploy** → **Build settings**
2. Ensure:
   - **Base directory**: (leave empty unless project is in subdirectory)
   - **Build command**: `npm run build` (or leave empty to use netlify.toml)
   - **Publish directory**: `dist`

### Step 4: Check Repository Structure
Ensure these files are at the repository root:
- `package.json` ✅
- `netlify.toml` ✅
- `.nvmrc` ✅
- `vite.config.js` ✅

### Step 5: Manual Override (If Still Failing)
If the above doesn't work, try setting Node version directly in Netlify UI:
1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Remove `NODE_VERSION` if it exists
3. Add:
   - **Key**: `NODE_VERSION`
   - **Value**: `18.20.4` (specific version)

## Alternative: Use Netlify Build Plugin
If manual configuration doesn't work, you can use a build plugin:
1. Go to **Site settings** → **Build & deploy** → **Build plugins**
2. Search for "Node.js version"
3. Install and configure

## Current Configuration Files

### `.nvmrc`
```
18
```

### `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### `package.json`
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

## Verification
After making changes:
1. Trigger a new deploy
2. Check build logs for:
   - "Installing dependencies"
   - "Installing Node.js version 18"
   - "Running npm run build"

If you see "npm: command not found" in the logs, Node.js is not being installed properly.

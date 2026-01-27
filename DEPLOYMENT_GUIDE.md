# Deployment Guide - SPA Routing Fix

## Problem
When reloading pages like `/fr/`, `/gr/`, or `/al/`, you get a 404 error because the server doesn't know about these client-side routes.

## Solution
The server needs to be configured to serve `index.html` for all routes. Configuration files have been created for different hosting providers.

## Important Notes
- Files in `public/` folder are automatically copied to `dist/` during build
- The `_redirects` and `.htaccess` files will be in your `dist/` folder after build
- Make sure these files are deployed with your build

## Hosting Provider Setup

### 1. Netlify
✅ **Easiest Solution**
- The `public/_redirects` file is already created
- After build, it will be in `dist/_redirects`
- Just deploy - Netlify will automatically use it
- No additional configuration needed

**Steps:**
1. Build: `npm run build`
2. Deploy the `dist/` folder to Netlify
3. The `_redirects` file will be automatically detected

### 2. Vercel
✅ **Easiest Solution**
- The `vercel.json` file is already created in the root
- Just deploy - Vercel will automatically use it
- No additional configuration needed

**Steps:**
1. Build: `npm run build`
2. Deploy to Vercel (via CLI or GitHub integration)
3. The `vercel.json` will be automatically used

### 3. Apache Server (cPanel, Shared Hosting)
✅ **Most Common for Shared Hosting**
- The `public/.htaccess` file is already created
- After build, copy `dist/.htaccess` to your server's root directory
- Make sure `mod_rewrite` is enabled (usually enabled by default)

**Steps:**
1. Build: `npm run build`
2. Upload all files from `dist/` to your server's public_html or www directory
3. Make sure `.htaccess` is in the root (same folder as `index.html`)
4. Test: Visit `https://premiumiptv.live/fr/` and reload

**If .htaccess doesn't work:**
- Contact your hosting provider to enable `mod_rewrite`
- Or ask them to configure SPA routing for you

### 4. Nginx Server (VPS/Dedicated Server)
- Copy the contents of `nginx.conf` to your Nginx server configuration
- Update the `root` path to match your deployment directory
- Reload Nginx: `sudo nginx -s reload`

**Steps:**
1. SSH into your server
2. Edit your Nginx config: `sudo nano /etc/nginx/sites-available/premiumiptv.live`
3. Add the location block from `nginx.conf`:
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```
4. Test config: `sudo nginx -t`
5. Reload: `sudo nginx -s reload`

### 5. Node.js Server (Express)
- Use the provided `server.js` file
- Run: `npm run serve` or `npm start`

**Steps:**
1. Build: `npm run build`
2. Run: `npm run serve`
3. Server will start on port 3000 (or PORT environment variable)

### 6. Other Hosting Providers
Most hosting providers support one of the above methods. Check your hosting provider's documentation for:
- "SPA routing" or "Single Page Application routing"
- "History API fallback"
- "Catch-all route" or "Fallback to index.html"

## Quick Test After Deployment
1. Navigate to `https://premiumiptv.live/fr/`
2. Reload the page (F5 or Ctrl+R)
3. The page should load correctly instead of showing 404
4. Test all language routes: `/fr/`, `/gr/`, `/al/`
5. Test blog routes: `/fr/blog`, `/gr/blog/article-slug`

## Development
The Vite dev server handles SPA routing automatically. Just run:
```bash
npm run dev
```

All routes work correctly in development mode.

## Troubleshooting

### Still getting 404 after deployment?
1. **Check file location**: Make sure `.htaccess` or `_redirects` is in the root directory (same as `index.html`)
2. **Check file permissions**: On Linux servers, `.htaccess` needs proper permissions
3. **Check server logs**: Look for rewrite errors in Apache/Nginx logs
4. **Clear cache**: Clear browser cache and try again
5. **Contact hosting support**: Ask them to enable SPA routing or mod_rewrite

### For Apache (.htaccess not working)
- Verify `mod_rewrite` is enabled: Create a test file with `<?php phpinfo(); ?>` and check for mod_rewrite
- Check if `.htaccess` is being read: Add a test rewrite rule
- Some hosts require `.htaccess` in a specific location

### For Netlify (_redirects not working)
- Make sure `_redirects` is in the `dist/` folder after build
- Check Netlify deploy logs for redirect processing
- Verify the file is not being ignored by `.gitignore`

# EMS Agency Real Estate - GitHub / Vercel Export

This is an export of the current EMS Agency frontend, not a new template.

Contents: 6 public pages, property detail, admin dashboard shortcut, 4 languages, dark/light mode, CSS, JS, 3:4 galleries, original logo assets and local static photos. The original 97 public site files are included in their original paths.

## Deploy with GitHub and Vercel

1. Unzip EMS_Agency_Vercel_GitHub.zip.
2. Create a new repository on https://github.com/new (for example: ems-agency-realestate).
3. Upload the CONTENTS of the extracted folder, not the ZIP itself. Ensure index.html, css/, js/, assets/ are in the repository root.
4. Visit https://vercel.com/new, connect your GitHub account, choose this repository and click Import.
5. Select Framework Preset: Other; Root Directory: .; Build Command: blank; Output Directory: . (if prompted).
6. Click Deploy and test the public pages.

## Wix CMS and Forms — Important

The properties, property gallery media and contact form are still served live by your Wix Headless CMS and Wix Forms. The public OAuth client ID is in js/wix/config.js. Keep your Wix site and backend enabled. This export does NOT copy the Wix database or customer messages into Vercel.

The existing admin.html is a Wix dashboard navigation hub, not a separate Vercel backend. Some old unreferenced JS files remain in this export for fidelity. Do not commit private passwords or secret API keys.

After moving code to GitHub, any frontend code edits made in Wix will NOT automatically update Vercel. Edit/push GitHub for frontend changes. CMS changes made in Wix can still appear dynamically in Vercel.

## Test status

All 97 public source files were downloaded successfully and are in this archive. Testing the site through a separate local static HTTP origin in Chromium loaded home property cards, the properties page, the Martil details/gallery and a live Wix-backed contact form, without reported page errors. No actual contact submission was sent; test this manually after deployment.

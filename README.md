# North Star Bakery — Touchstone 3

This project continues Kelvin ogbeide's Touchstone Task 2 website.
All four original pages and required form/media elements are retained.
The shared styles.css adds a four-color, two-font, mobile-first design.
No JavaScript, external fonts, or build dependencies are required.

## Files
- index.html — welcome, featured cookies, visit information and audio
- products.html — categories, pricing and Signature Loaf figure
- about.html — bakery story, sourcing and team
- contact.html — location, hours and labeled inquiry/pre-order form
- styles.css — shared design, Flexbox and 48rem desktop breakpoint
- media/ — seven supplied bakery images and welcome audio

## Preview locally or in Codespaces
Run this from the project folder:

    python3 -m http.server 8000

In Codespaces, use the Ports panel to open port 8000 in the browser.
Keep the process running while reviewing. If sharing a forwarded preview,
verify its access settings and test the URL while signed out. A stopped
Codespace will not provide a working preview.
For a local preview, open http://localhost:8000/index.html instead.

## Online project
Repository: https://github.com/kelving505050/north-star-bakery-touchstone-3

This repository contains the complete four-page website and supplied media.
Use the local/Codespaces instructions above to preview the project.

## Testing completed
All four pages checked at 375px, 768px and 1280px viewport widths with
no horizontal overflow. Contact also checked at 320px. Relative links,
media paths, labels, headings and shared stylesheet checked locally.
Blank required fields block submission. No real form data was sent.

## Coursework limitations
The address, prices, hours, staff and bakery story are sample content.
The HTML form has no processing backend; successful validation does not
place an order. Use sample data only. Pickup availability and conditional
date requirements need future backend validation.

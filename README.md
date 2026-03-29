# EDITZAAR — Website Files

## Folder Structure

```
editzaar/
├── index.html          ← Main HTML file
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← All JavaScript (animations, form, filters)
└── README.md           ← This file
```

## How to Use in VS Code

1. Open the `editzaar/` folder in VS Code
2. Install the **Live Server** extension (by Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**
4. Your site opens at `http://127.0.0.1:5500`

## Customisation Checklist

### 1. WhatsApp Number
In `js/main.js`, replace `918888888888` with your actual number (country code + number, no + sign):
```js
var waNumber = '919876543210'; // your number here
```
It appears in **two places** in main.js — update both.

### 2. Payment Links
In `index.html`, find the pricing CTA buttons and update the `href` values:
```html
<a class="plan-cta-gold" href="https://rzp.io/rzp/YOUR_LINK">Get started</a>
```

### 3. Real Videos
Replace the `.vthumb` placeholder divs with actual `<video>` or thumbnail `<img>` tags:
```html
<!-- Replace this: -->
<div class="vthumb t1">...</div>

<!-- With this: -->
<img src="thumbnails/video1.jpg" alt="Finance Documentary" class="vthumb" style="object-fit:cover;" />
```

### 4. Stats Numbers
In `index.html`, update the `data-count` values to match your real numbers:
```html
<div class="hstat-n" data-count="12" data-suffix="M+">0</div>
```

### 5. Brand Colours
All colours are CSS variables in `css/style.css`:
```css
:root {
  --gold: #BFA46A;   /* Main accent colour */
  --bg:   #080808;   /* Page background    */
}
```

### 6. Social Links
In `index.html` footer, update all `href` values:
```html
<a href="https://www.instagram.com/YOUR_HANDLE/">Instagram</a>
```

## Features Included

- Custom gold cursor glow effect (desktop only)
- Typing headline animation (cycles through 6 phrases)
- Scroll reveal animations on all sections
- Animated number counters (trigger on scroll)
- Video portfolio with category filters (All / Documentary / Reels / AI / Wedding / Animation)
- "Book similar" buttons on each video card → opens WhatsApp with pre-filled message
- Pricing comparison table with featured column
- Scrolling partner logo strip
- Booking form → WhatsApp with plan + name + phone + project details
- Sticky navbar with scroll shadow
- Smooth scroll on anchor links
- Mobile responsive with hamburger menu
- No frameworks needed — pure HTML, CSS, JavaScript

## Browser Support

Works in all modern browsers: Chrome, Firefox, Safari, Edge.
Custom cursor is hidden on mobile (touch devices).

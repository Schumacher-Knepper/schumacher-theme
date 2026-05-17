# Schumacher-Knepper Theme

This repository contains the custom Shopify theme for **Schumacher-Knepper**, a premium wine seller from Luxembourg. Built on top of Shopify's reference theme **Dawn**, this project introduces a fully customized, high-end "Liquid Glass" aesthetic and several bespoke functional enhancements while maintaining the core performance principles of the base theme.

## ✨ Key Features

### "Liquid Glass" Design System
- **Glassmorphism Aesthetic**: Extensive use of backdrop blurs, subtle transparencies, and minimal borders to create a premium, modern feel.
- **Rounded UI**: Consistent application of rounded corners across cards, modals, and media elements (utilizing custom variables like `--media-radius`).

### Bespoke Components & Functionality
- **Compliance Age Verification**: A lightweight, custom-styled age verification modal added to ensure compliance and audit readiness.
- **Heritage Countdown**: A custom interactive slideshow component that features a dynamic countdown to the year **1714**, celebrating the brand's winemaking heritage.
- **Product Details Grid**: A block-based grid system embedded in the product page to display complex wine metadata in a clean, structured layout.
- **Intelligent Breadcrumbs**: Custom breadcrumb navigation following the structure: `All wines > [Metaobject Category] > [Product Title]`.

## 🛠 Bug Fixes & Optimizations

On top of the visual overhaul, this theme includes several critical fixes and optimizations over the base Dawn template:
- **Mobile Viewport Stability**: Resolved persistent mobile layout and scrolling issues associated with fixed-position modals (including Age Verification and Quick Add modals) that are common in the base theme.
- **iOS Scroll Locking**: Implemented robust scroll-locking mechanisms (using advanced CSS and touch-action controls) to prevent background page scrolling on mobile devices while modals are active.
- **Minimal JS Footprint**: Relied heavily on Dawn's native JavaScript execution. Custom JS was added sparingly and purposefully, primarily for handling the behavior and state of the age verification popup.

## 🚀 Local Development

This project uses the Shopify CLI for development. Node scripts are provided in `package.json` for convenience.

### Prerequisites
- Node.js or Bun
- Shopify CLI

### Getting Started

1. Clone the repository.
2. Start the development server:

```bash
npm run dev
# or
bun dev
```

This command will start the Shopify development server and proxy requests to the `schumacher-knepper-v2` development store.

### Other Commands

- `npm run push`: Push the current theme state to the store.
- `npm run check`: Run Theme Check to lint and validate Liquid code.
- `npm run login`: Authenticate with Shopify CLI.
- `npm run logout`: Log out of Shopify CLI.

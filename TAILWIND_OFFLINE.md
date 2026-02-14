# Tailwind CSS Offline Guide

## How Tailwind CSS Works Offline

You asked: **"Do we get Tailwind offline? How and where?"**

The short answer is: **Yes, Tailwind CSS works 100% offline.**

### 1. How It Works
Tailwind CSS is a **build-time tool**. This means:
1.  When you run `npm run dev` or `npm run build`, Tailwind scans your files (`.tsx`, `.ts`) for class names (like `bg-red-500`, `flex`, `p-4`).
2.  It generates a standard `.css` file containing *only* the styles you used.
3.  This CSS file is served directly by your Next.js server (localhost:3000).

### 2. No Internet Required
-   **Runtime:** Unlike Google Fonts or CDN scripts (e.g., Bootstrap from a CDN), Tailwind does **not** make any network requests when your app is running.
-   **Development:** You do not need an internet connection to develop with Tailwind once your `node_modules` are installed.

### 3. Where is it?
-   The source configuration is in your project root (since you are using v4, it might be in CSS or config).
-   The output CSS is injected into your application automatically by Next.js.
-   You do **not** need to download any extra files for Tailwind to work offline. It is already part of your project's `node_modules`.

### Summary
As long as you have run `npm install` once (to get the packages), you can disconnect from the internet and Tailwind will continue to style your application perfectly.

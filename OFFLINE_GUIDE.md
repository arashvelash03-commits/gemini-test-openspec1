# Offline Setup Guide

This application has been configured to work fully offline by using local font files instead of fetching them from Google Fonts.

However, because font files (especially proprietary or large ones) are not always included in the repository by default, you must download them manually and place them in the correct directory.

## 1. Required Files

You need to download the following `.woff2` files and place them in the `src/app/fonts/` directory.

| Font Name | Filename to Save As | Download Source (Examples) |
| :--- | :--- | :--- |
| **Vazirmatn** (Variable) | `Vazirmatn-Variable.woff2` | [Google Fonts](https://fonts.google.com/specimen/Vazirmatn) or [GitHub](https://github.com/rastikerdar/vazirmatn/releases) (Look for `Vazirmatn-Variable.woff2` or `Vazirmatn[wght].woff2` and rename it) |
| **Material Symbols** | `MaterialSymbolsOutlined.woff2` | [Google Fonts Symbols](https://fonts.google.com/icons) (Select "Material Symbols Outlined", go to "Variable Font" or "Static", download the `.woff2` file). Alternatively, direct link: `https://fonts.gstatic.com/s/materialsymbolsoutlined/v175/kJF1BvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzaxHMPdY43zj-jCxv3fzvRNU22ZXGJpEpjC_1n-q_4MrImHCIJIZrDCvHOej.woff2` (Note: Links change, best to find a stable source) |
| **Geist Sans** (Variable) | `GeistVF.woff2` | [Vercel Geist Font](https://vercel.com/font) or check `node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2` if installed. |
| **Geist Mono** (Variable) | `GeistMonoVF.woff2` | [Vercel Geist Font](https://vercel.com/font) or check `node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2` if installed. |

## 2. Directory Structure

Ensure your `src/app/fonts/` directory looks like this:

```
src/
  app/
    fonts/
      GeistVF.woff2
      GeistMonoVF.woff2
      Vazirmatn-Variable.woff2
      MaterialSymbolsOutlined.woff2
      material-symbols.css  <-- (Already created by the dev agent)
```

## 3. Enable Local Fonts in Code

Because GitHub repositories cannot host large binary files by default, the code in `src/app/layout.tsx` has been commented out to prevent build errors.

**After you download the font files:**

1.  Open `src/app/layout.tsx`.
2.  Uncomment the `localFont` configuration blocks for `geistSans`, `geistMono`, and `vazirmatn`.
3.  Update the `body` tag className to include the font variables:
    ```tsx
    <body className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} antialiased`}>
    ```

## 4. Verify Offline Mode

1.  Disconnect from the internet.
2.  Run the development server: `npm run dev`
3.  Open the application in your browser.
4.  Check the "Network" tab in Developer Tools. Ensure no requests are being made to `fonts.googleapis.com` or `fonts.gstatic.com`.
5.  Verify that icons (like the login page user/lock icons) and text are rendering correctly.

## Troubleshooting

-   **Squares instead of Icons:** This means `MaterialSymbolsOutlined.woff2` is missing or the path in `material-symbols.css` is incorrect.
-   **Default/Wrong Font:** This means `Vazirmatn-Variable.woff2` is missing. The browser fell back to a system font.
-   **Build Errors:** If Next.js complains about missing files, you **must** download the files listed above before the build will succeed.

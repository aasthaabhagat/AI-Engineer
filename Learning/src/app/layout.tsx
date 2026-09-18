import type { Metadata } from "next";
import "./globals.css";
import { STORAGE_KEY } from "@/lib/state";
import { StoreProvider } from "@/lib/store";
import { Shell } from "@/components/Shell";
import { CommandPalette } from "@/components/CommandPalette";
import { CueRunner } from "@/components/CueRunner";

export const metadata: Metadata = {
  title: "AI Engineer Training OS",
  description:
    "Personal training system: what to learn, build, test, commit and ship today.",
};

/**
 * The saved theme lives in localStorage, which React cannot read until after
 * hydration. Applying it in an effect means a light page paints first and then
 * snaps to dark. This runs before first paint instead, so there is no flash.
 *
 * It is deliberately tiny and failure-tolerant: any problem leaves the
 * document on the default theme already set on <html>.
 */
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)});if(!s)return;var t=JSON.parse(s);if(t&&t.settings&&(t.settings.theme==="dark"||t.settings.theme==="light")){document.documentElement.dataset.theme=t.settings.theme}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-bg text-ink antialiased">
        <StoreProvider>
          <Shell>{children}</Shell>
          <CommandPalette />
          <CueRunner />
        </StoreProvider>
      </body>
    </html>
  );
}

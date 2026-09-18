import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Shell } from "@/components/Shell";
import { CommandPalette } from "@/components/CommandPalette";

export const metadata: Metadata = {
  title: "AI Engineer Training OS",
  description:
    "Personal training system: what to learn, build, test, commit and ship today.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark">
      <body className="min-h-screen bg-bg text-ink antialiased">
        <StoreProvider>
          <Shell>{children}</Shell>
          <CommandPalette />
        </StoreProvider>
      </body>
    </html>
  );
}

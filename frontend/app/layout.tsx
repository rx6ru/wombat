import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider"; // Import ThemeProvider

const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Wombat Vault", // Update title
  description: "Securely store and manage your API keys.", // Update description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceMono.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Set default theme to dark
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
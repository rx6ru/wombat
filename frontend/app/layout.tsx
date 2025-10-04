    import type { Metadata } from "next";
    import { Inter } from "next/font/google";
    import "./globals.css";
    import { ThemeProvider } from "@/components/ThemeProvider";

    const inter = Inter({ subsets: ["latin"] });

    export const metadata: Metadata = {
      title: "Wombat Vault",
      description: "Securely store and manage your API keys with proxy access.",
    };

    export default function RootLayout({
      children,
    }: Readonly<{
      children: React.ReactNode;
    }>) {
      return (
        <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </body>
        </html>
      );
    }
   


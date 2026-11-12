//src/app/layout.tsx

import type { Metadata } from "next";
import { Roboto, Roboto_Serif, Roboto_Mono, Geist } from "next/font/google";
import "./globals.css";
import { Providers, ThemeProvider } from "./providers";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const fontSerif = Roboto_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Agenda",
    template: "%s | Agenda"
  },
  description: "Agenda de ajuste de peças",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning className={cn("h-full", "antialiased", fontSerif.variable, fontMono.variable, "font-sans", geist.variable)}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>

      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <Providers>
            <TooltipProvider>
              {children}
            </TooltipProvider>
            <Toaster richColors closeButton={true} position="top-right" expand={true} visibleToasts={3} />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

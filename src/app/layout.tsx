import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConsentBanner } from "@/components/ConsentBanner";
import { Toaster } from "react-hot-toast";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const metadataBase = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : undefined;

export const metadata: Metadata = {
  title: "Plataforma de Vagas | DW Solutions",
  description: "Encontre as melhores oportunidades profissionais.",
  applicationName: "DW Solutions",
  keywords: ["Vagas", "Emprego", "Oportunidades", "Recrutamento"],
  metadataBase,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Plataforma de Vagas | DW Solutions",
    description: "Encontre as melhores oportunidades profissionais.",
    siteName: "DW Solutions",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plataforma de Vagas | DW Solutions",
    description: "Encontre as melhores oportunidades profissionais.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="top-right" />
            {children}
            <ConsentBanner />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

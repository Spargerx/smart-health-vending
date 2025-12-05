import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "स्मार्ट हेल्थ असिस्टेंस वेंडिंग मशीन",
    description:
        "बुद्धिमान ट्राइएज द्वारा संचालित आपका त्वरित, निर्देशित प्राथमिक चिकित्सा भागीदार।",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="hi" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <LanguageProvider forcedLanguage="Hindi">
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
}

import React, { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import LoadingSpinner from "./Components/LoadingSpinnerComponent/LoadingSpinner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "POS | Integrated Advanced ERP v2.0.1",
  description:
    "Elevate your Business Management with Snave Webhub Africa's cutting-edge Seamless ERP-POS system. Our solution integrates seamlessly with KRA eTIMS and offers diverse payment options, optimizing efficiency and fostering growth in a competitive landscape.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <meta
          name="keywords"
          content="Seamless, ERP, POS, Business Management Software, Snave Webhub Africa"
        />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/snavelogo.jpg" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <link rel="icon" href="/snavelogo.jpg" />
        <title>{metadata.title}</title>
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}

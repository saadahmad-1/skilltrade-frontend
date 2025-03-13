import localFont from "next/font/local";
import "./globals.css";

import AuthLayout from "./components/auth/AuthLayout";
import Navbar from "./components/layout/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Skill Trade",
  description: "Skill Trade is a platform for trading skills.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black bg-gradient-to-b from-neutral-900 to-black`}
      >
        <AuthLayout>
          <Navbar />
          {children}
        </AuthLayout>
      </body>
    </html>
  );
}

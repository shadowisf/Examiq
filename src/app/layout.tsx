import type { Metadata, Viewport } from "next";
import "./main.scss";
import NavBar from "@/app/components/NavBar";
import AccentColor from "./components/AccentColor";

export const metadata: Metadata = {
  title: "examiq",
  description: "",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <AccentColor />

        {children}
      </body>
    </html>
  );
}

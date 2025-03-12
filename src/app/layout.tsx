import type { Metadata } from "next";
import "./main.scss";
import NavBar from "@/app/components/NavBar";

export const metadata: Metadata = {
  title: "examiq",
  description: "",
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

        {children}
      </body>
    </html>
  );
}

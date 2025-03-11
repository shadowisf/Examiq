import type { Metadata } from "next";
import "./main.scss";
import NavBar from "@/app/components/NavBar";
import { LoaderProvider } from "./components/Loader";

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

        <LoaderProvider>{children}</LoaderProvider>
      </body>
    </html>
  );
}

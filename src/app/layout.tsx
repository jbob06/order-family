import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Order Family Manager",
  description: "Group and manage customer orders into logical families",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

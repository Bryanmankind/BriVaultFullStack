// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { Web3Provider } from "@/context/Web3Context"; // make sure the path is correct

export const metadata = {
  title: "BriVault Tournament",
  description: "Stake, choose a team, and win the vault on-chain",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}

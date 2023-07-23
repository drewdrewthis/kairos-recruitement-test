import "reflect-metadata";
import "./styles/globals.scss";
import React from "react";
import { Inter, Righteous } from "next/font/google";
import {
  MuiWrapper,
  RainbowKitWrapper,
  ReactQueryClientProvider,
} from "@/components/providers";
import StyledComponentsRegistry from "../components/providers/StyledComponentRegistry";
import { SnackbarProvider } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const righteous = Righteous({
  subsets: ["latin"],
  variable: "--font-righteous",
  weight: ["400"],
});

export const metadata = {
  title: "Kairos NFT Staking App",
  description: "The coolest app around",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <MuiWrapper>
        <html lang="en" className="h-full">
          <body
            className={`${inter.variable} ${righteous.variable} font-sans bg-slate-900 min-h-screen`}
          >
            <StyledComponentsRegistry>
              <SnackbarProvider>
                <RainbowKitWrapper>{children}</RainbowKitWrapper>
              </SnackbarProvider>
            </StyledComponentsRegistry>
          </body>
        </html>
      </MuiWrapper>
    </ReactQueryClientProvider>
  );
}

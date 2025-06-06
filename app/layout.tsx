import type React from "react"
import type { Metadata } from "next"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner";
import "./globals.css"
import {Poppins} from 'next/font/google'
import { Playfair_Display } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"


import '@fontsource/inter/300.css'; // Light
import '@fontsource/inter/400.css'; // Regular
import '@fontsource/inter/500.css'; // Medium
import '@fontsource/inter/700.css'; // Bold

const poppins = Poppins({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const playfairDisplay = Playfair_Display({
  weight: ['400', '500', '600', '700'],  
  subsets: ['latin'],
  variable: '--font-playfairDisplay',  
});

export const metadata: Metadata = {
  title: "LifeLink - Personalized Medical Advice",
  description: "Your elegant LifeLink application",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${poppins.variable} ${playfairDisplay.variable}  antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<SidebarProvider>
						<div className="flex w-full h-screen overflow-hidden">
							<AppSidebar />
							<main className="flex-1 overflow-auto">
								{children}
								<Analytics />
							</main>
							<Toaster />
						</div>
					</SidebarProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}

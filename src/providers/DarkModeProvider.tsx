// app/providers.tsx
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="dark">
            {children}
        </NextThemesProvider>
    )
}
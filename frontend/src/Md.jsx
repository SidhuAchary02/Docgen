"use client"

import { useState, useEffect } from "react"
import { RichTextEditor } from "./components/tiptap/RichTextEditor"
import { ThemeProvider } from "./components/ThemeProvider"
import "./index.css"

function Md() {
  const [mounted, setMounted] = useState(false)

  // Ensure hydration is complete before rendering editor
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex flex-col min-h-screen">
        <header className="py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-start gap-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Tiptap Rich Text Editor
              </h1>
              <p className="text-xl">A powerful WYSIWYG editor built with React</p>
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8" id="editor">
          {mounted && <RichTextEditor className="w-full rounded-xl" />}
        </main>
        <footer className="border-t py-6 md:px-8 md:py-0 w-full">
          <div className="container py-4 mx-auto">
            <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with React and Tiptap
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default Md
import BackgroundPaths from "./components/home/BackgroundPaths"
import { Header } from "./components/home/Header"
import { HeroSection } from "./components/home/HeroSection"
import MenuBar from "./Menubar"
import SimpleEditor from "./SimpleEditor"

export default function Home({editor}) {
  return (
    <main className="min-h-screen bg-black">
      {/* <Header /> */}
      {/* <HeroSection /> */}
      {/* <BackgroundPaths /> */}
      <SimpleEditor />
      <MenuBar editor={editor}/>
    </main>
  )
}

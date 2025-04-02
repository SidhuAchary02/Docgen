import { Button } from "../../ui/Button"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-black/50 border border-b-white/10">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-3">
            <img
              src="./nameLogoWhite.svg"
              className="w-30"
            />
          </a>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            Products
          </a>
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            Help
          </a>
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            Community
          </a>
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            Contact
          </a>
        </nav>
        <Button variant="secondary" className="bg-white text-black hover:bg-gray-100">
          Download
        </Button>
      </div>
    </header>
  )
}

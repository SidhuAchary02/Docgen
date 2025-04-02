import { ShineBorder } from "../../ui/ShineBorder";
import { Play } from "lucide-react";
import { Button } from "../../ui/Button";
import { InteractiveGrid } from "../../ui/InteractiveGrid";

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 pb-16 overflow-hidden bg-black">
      {/* InteractiveGrid is below other elements */}
      <InteractiveGrid
        containerClassName="absolute inset-0"
        className="opacity-30"
        points={40}
      />
      <ShineBorder
        className="relative z-10 max-w-6xl mx-auto px-6"
        borderClassName="border border-white/10 rounded-xl overflow-hidden"
      >
        <div className="text-center my-16" style={{ pointerEvents: "auto" }}>
          <h1 className="text-4xl inline-block text-transparent bg-clip-text 
                                        bg-gradient-to-r from-neutral-900 to-neutral-700/80 
                                        dark:from-white dark:to-white/80 md:text-5xl font-bold mb-6 tracking-tight pt-8">
            Your complete platform for Docs.
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Docgen provides the AI-powered tools and seamless integrations to
            generate, maintain, and scale accurate documentation — so you can
            focus on building better software.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => console.log("Start Generating clicked")}
              className="bg-white flex gap-1 py-1 px-2 items-center text-black hover:bg-gray-100 font-semibold cursor-pointer rounded"
            >
              <img src="./onlyLogoBlack.svg" alt="" width={18} />
              Start Generating
            </button>
            <Button
              variant="outline"
              className="gap-2 text-white border-white/10 bg-white/5 hover:bg-white/10"
              onClick={() => console.log("Demo clicked")}
            >
              <Play className="w-4 h-4" />
              Demo
            </Button>
          </div>
        </div>

        <ShineBorder
          className="relative mx-auto"
          borderClassName="border border-white/10 rounded-xl overflow-hidden"
        >
          <div className="relative">
            <img
              src="./heroImage.png"
              alt="Background Gradient"
              width={1920}
              height={1080}
              className="w-full h-auto"
              priority
            />
            <div className="absolute inset-0 flex items-end justify-center pb-16">
              <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl w-[100%] h-[70%] flex">
                <div className="flex-1 pr-2">
                  <img
                    src="./code.png"
                    alt="Browser Preview"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover rounded-lg"
                    priority
                  />
                </div>
                <div className="flex-1 pl-2">
                  <img
                    src="./readme.png"
                    alt="Code Editor"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover rounded-lg"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </ShineBorder>
      </ShineBorder>
    </section>
  );
}

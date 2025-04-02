// import { BookText, CircleDashed, ChevronRightIcon } from "lucide-react";
// import { Loader } from "./Loader";

// export default function GeneratingStatus() {
//   return (
//     <div className="bg-black text-white flex items-center justify-center p-4 mt-5">
//       <div className="w-[680px] max-w-2xl bg-black border border-zinc-800 rounded-lg p-6">
//         <h1 className="text-2xl font-bold flex items-center gap-1 mb-2 text-gray-300">
//           Generating Docs <BookText />
//         </h1>
//         <div>
//           <div className="border border-zinc-800 rounded-lg overflow-hidden mb-6">
//             {/* Build Logs - Expanded */}
//             <div className="bg-[#1A1A1A] p-4 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <ChevronRightIcon />

//                 <span className="font-medium">Parsing code</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-gray-400">5s</span>
//                 <Loader size="sm" />
//               </div>
//             </div>

//             {/* Deployment Summary - Collapsed */}
//             <div className="border-t border-gray-800 p-4 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <ChevronRightIcon />
//                 <span className="font-medium text-gray-400">
//                   Extracting Comments, params
//                 </span>
//               </div>
//               <CircleDashed className="w-4 h-4" />
//             </div>

//             {/* Assigning Custom Domains - Collapsed */}
//             <div className="border-t border-gray-800 p-4 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <ChevronRightIcon />
//                 <span className="font-medium text-gray-400">
//                   Formatting Mardown Files
//                 </span>
//               </div>
//               <CircleDashed className="w-4 h-4" />
//             </div>
//           </div>
//           <button className="bg-black hover:bg-zinc-900 text-white border border-zinc-800 rounded-md px-4 py-2 cursor-pointer">
//             Cancel Generating
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { BookText, CircleDashed, ChevronRightIcon, CheckCircle } from "lucide-react";
import { Loader } from "../../utils/Loader";

const steps = [
  "Parsing code",
  "Extracting Comments, params",
  "Formatting Markdown Files",
  "Finalizing Documentation",
];

export default function GeneratingStatus({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => onComplete(), 1000); // Call onComplete after finishing all steps
            return prev;
          }
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isGenerating, onComplete]);

  return (
    <div className="bg-black text-white flex items-center justify-center p-4 mt-5">
      <div className="w-[680px] max-w-2xl bg-black border border-zinc-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold flex items-center gap-1 mb-2 text-gray-300">
          Generating Docs <BookText />
        </h1>
        <div>
          <div className="border border-zinc-800 rounded-lg overflow-hidden mb-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`p-4 flex items-center justify-between border-t border-gray-800 ${
                  index === 0 ? "border-none" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {index < currentStep ? (
                    <CheckCircle className="text-green-400" />
                  ) : index === currentStep ? (
                    <CircleDashed className="text-yellow-400 animate-spin" />
                  ) : (
                    <ChevronRightIcon className="text-gray-500" />
                  )}
                  <span className={`font-medium ${index <= currentStep ? "text-white" : "text-gray-400"}`}>
                    {step}
                  </span>
                </div>
                {index < currentStep ? (
                  <span className="text-green-400">Done</span>
                ) : index === currentStep ? (
                  <Loader size="sm" />
                ) : (
                  <CircleDashed className="w-4 h-4" />
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsGenerating(false)}
            className="bg-black hover:bg-zinc-900 text-white border border-zinc-800 rounded-md px-4 py-2 cursor-pointer"
          >
            Cancel Generating
          </button>
        </div>
      </div>
    </div>
  );
}

export function Loader({ size = "md", className = "" }) {
    const sizeClasses = {
      sm: "w-4 h-4 border-2",
      md: "w-8 h-8 border-3",
      lg: "w-12 h-12 border-4",
    }
  
    const spinnerSize = sizeClasses[size] || sizeClasses.md
  
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div
          className={`${spinnerSize} rounded-full border-gray-300 border-t-pink-500 animate-spin`}
          role="status"
          aria-label="Loading"
        />
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
  
  export function LoaderWithText({ text = "Loading...", size = "lg", className = "" }) {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <Loader size={size} />
        <p className="text-sm text-gray-500">{text}</p>
      </div>
    )
  }
  
  // Usage example
  export default function LoaderExample() {
    return (
      <div className="flex flex-col items-center gap-8 p-8">
        <h2 className="text-xl font-bold mb-4">Loader Sizes</h2>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <Loader size="sm" />
            <span className="mt-2 text-sm">Small</span>
          </div>
          <div className="flex flex-col items-center">
            <Loader size="md" />
            <span className="mt-2 text-sm">Medium</span>
          </div>
          <div className="flex flex-col items-center">
            <Loader size="lg" />
            <span className="mt-2 text-sm">Large</span>
          </div>
        </div>
  
        <h2 className="text-xl font-bold mt-8 mb-4">Loader With Text</h2>
        <LoaderWithText text="Processing your request..." />
      </div>
    )
  }
  
  
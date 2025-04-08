import SimpleEditor from "./SimpleEditor"

export default function Home() {
  return (
    <main className="min-h-screen bg-black p-4 flex justify-center items-start">
      <div className="w-full max-w-4xl">
        <SimpleEditor />
      </div>
    </main>
  )
}


import { Button, Heading } from "@modules/common/components/ui"

const Hero = () => {
  return (
    <div className="h-[80vh] w-full relative overflow-hidden bg-[#FAF9F5] border-b border-[#EAE6DF]">
      {/* Decorative luxury abstract elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(235,229,219,0.4)_0%,transparent_70%)] z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F2EDE4] rounded-full filter blur-[100px] opacity-60 animate-pulse duration-[8000ms] z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#EAE3D5] rounded-full filter blur-[120px] opacity-50 z-0" />

      {/* Main Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-6 gap-8">
        <div className="space-y-4 animate-fade-in-top">
          <span className="text-[10px] small:text-xs tracking-[0.4em] text-[#88857E] font-semibold uppercase block mb-2">
            La Collection Privée
          </span>
          <Heading
            level="h1"
            className="font-serif text-5xl small:text-8xl font-light tracking-[0.15em] text-[#1A1A1A] uppercase leading-none"
          >
            NIHAN
          </Heading>
          <div className="w-12 h-[1px] bg-[#88857E] mx-auto my-6" />
          <Heading
            level="h2"
            className="font-sans text-xs small:text-sm tracking-[0.3em] text-[#55524C] font-medium max-w-lg mx-auto leading-relaxed uppercase"
          >
            L'Élégance Intemporelle. <span className="text-[#88857E]">Timeless Sophistication.</span>
          </Heading>
        </div>

        <div className="flex flex-col small:flex-row gap-4 mt-4 z-20">
          <a href="/dk/categories/shirts">
            <button className="bg-[#1A1A1A] text-white hover:bg-[#333333] border border-[#1A1A1A] px-10 py-4 uppercase text-[10px] font-bold tracking-[0.25em] transition-all duration-300 ease-in-out hover:scale-[1.03] shadow-md rounded-none">
              Découvrir la Collection
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Hero

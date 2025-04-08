export default function HomePage() {
  return (
    <div className="font-serif flex flex-col items-center p-4">
      <h1 className="
    text-4xl sm:text-4xl md:text-4xl lg:text-4xl font-extrabold 
    text-transparent bg-clip-text bg-gradient-to-r from-[#d7d7d7] via-[#393E46] to-[#00ADB5]
    animate-pulse tracking-wide uppercase text-center 
    transform hover:scale-110 transition-all duration-500 ease-in-out 
    relative
    before:absolute before:content-['🚀'] before:-top-10 before:-left-10 before:text-7xl before:animate-spin
    after:absolute after:content-['🔥'] after:-bottom-10 after:-right-10 after:text-7xl after:animate-bounce select-none
  ">
        Welcome to AI Summarizer App
      </h1>
      <br />

      <form action="onSubmit" className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
        <textarea
          placeholder="Write your text here"
          className="w-full h-[490px] p-4 text-lg border border-gray-300 rounded-lg focus:outline-none 
      focus:ring-2 focus:black overflow-y-auto resize-none"
        ></textarea>

        <textarea
          placeholder="Read-Only Box"
          readOnly
          className="w-full h-[490px] p-4 text-lg border border-gray-300 rounded-lg bg-gray-200 
      text-gray-600 overflow-y-auto resize-none"
        ></textarea>
      </form>

      <div className="mt-6">
        <a
          href="/auth"
          className="font-serif inline-flex items-center gap-2 bg-blue-800 text-white font-semibold py-2 px-4 rounded-xl 
      shadow-md hover:bg-blue-700 active:bg-blue-600 transition-colors duration-300 ease-in-out w-auto focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Summarize
          <span className="bg-blue-300 text-white p-2 rounded-full flex items-center justify-center">
            ✔️
          </span>
        </a>
      </div>
    </div>
  );
}


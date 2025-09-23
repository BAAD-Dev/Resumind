import Image from "next/image";
import resumeIllustration from "../../../public/image/heroillus.png";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl text-[#162B60] font-extrabold leading-tight">
              This resume builder gets you{" "}
              <span className="text-blue-700">hired faster</span>
            </h1>
            <p className="mt-6 text-lg text-slate-500">
              Only 2% of resumes win. Yours will be one of them.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/analyze"
                className="bg-[#162B60] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
              >
                Analyze Resume With AI
              </Link>
              <Link
                href="/register"
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg text-lg"
              >
                Register Now
              </Link>
            </div>
            <div className="mt-6 text-slate-500 text-sm">
              <p className="inline-flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                39% more likely to land the job
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src={resumeIllustration}
              alt="Resume analysis illustration"
              width={500}
              height={450}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

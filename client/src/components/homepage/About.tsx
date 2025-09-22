import Image from 'next/image';
import Link from 'next/link';

const About = () => {
  return (
    <section id="about" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Image
              src="/image/about.jpg"
              alt="About Resumind Illustration"
              width={600}
              height={450}
              className="rounded-lg shadow-xl w-full"
            />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-primary sm:text-4xl">
              Built for the Modern Job Seeker
            </h2>
            <p className="mt-4 text-lg text-slate-700">
              Resumind is more than just a resume builder. We are your AI-powered career partner, designed to help you stand out from thousands of applicants.
            </p>
            <p className="mt-4 text-lg text-slate-700">
              Our platform analyzes your resume, providing an instant score and feedback to ensure it gets past the Applicant Tracking Systems (ATS) used by 90% of companies. Maximize your chances of landing an interview.
            </p>
            <div className="mt-8">
              <Link
                href="/analyze"
                className="inline-block bg-[#162B60] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
              >
                Try Free Analysis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default About;




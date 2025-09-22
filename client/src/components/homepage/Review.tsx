"use client";
import React from 'react';
import Image from 'next/image';

const reviews = [
  {
    quote: "Resumind completely changed my job search. The ATS analysis helped me get past the bots and in front of real recruiters. Landed a new role in 3 weeks!",
    name: "Gabriela Vania",
    title: "Frontend Developer",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?_gl=1*uw60ta*_ga*MTU0MTI1NTEwLjE3NTU2Njg0NDA.*_ga_8JE65Q40S6*czE3NTg1MjkyOTYkbzEwJGcxJHQxNzU4NTI5OTExJGoxNiRsMCRoMA..",
  },
  {
    quote: "As a developer, I know code, not keywords. This tool was a lifesaver. It pinpointed exactly what my resume was missing for the jobs I wanted.",
    name: "Alfikri Zein",
    title: "Backend Developer",
    avatar: "https://images.pexels.com/photos/25758/pexels-photo.jpg",
  },
  {
    quote: "I was stuck in a career rut. Resumind's feedback gave me the confidence to apply for senior roles. The premium plan is worth every penny.",
    name: "Dewi Aminah",
    title: "Frontend Developer",
    avatar: "https://images.pexels.com/photos/69494/pexels-photo-69494.jpeg",
  },
  {
    quote: "The interface is so clean and easy to use. I got an 97% match score on my dream job application and got the interview!",
    name: "Garin Akbar S.",
    title: "Full Stack Developer",
    avatar: "https://images.pexels.com/photos/1990/man-person-people-emotions.jpg",
  },
  {
    quote: "Resumind helped me create a professional resume and I received more interview calls than ever before.",
    name: "Fathan Mania Mantap",
    title: "Marketing Specialist",
    avatar: "https://images.pexels.com/photos/256522/pexels-photo-256522.jpeg",
  },
  {
    quote: "The actionable feedback made my resume stand out. I landed a job at a major tech company faster than I expected.",
    name: "Faqihihi",
    title: "Product Manager",
    avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
  },
  {
    quote: "The ATS analysis was a game changer for me. Now my resume always passes the initial screening stage.",
    name: "Axel Excel",
    title: "Software Engineer",
    avatar: "https://images.pexels.com/photos/39866/entrepreneur-startup-start-up-man-39866.jpeg?_gl=1*1htybee*_ga*MTU0MTI1NTEwLjE3NTU2Njg0NDA.*_ga_8JE65Q40S6*czE3NTg1MjkyOTYkbzEwJGcxJHQxNzU4NTI5NzEwJGoyNCRsMCRoMA..",
  },
  {
    quote: "Applying for jobs became so much easier with Resumind. The tips are relevant for various positions.",
    name: "Intan Permata",
    title: "Data Analyst",
    avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?_gl=1*1ijh2rb*_ga*MTU0MTI1NTEwLjE3NTU2Njg0NDA.*_ga_8JE65Q40S6*czE3NTg1MjkyOTYkbzEwJGcxJHQxNzU4NTI5Nzk2JGoyOCRsMCRoMA..",
  }
];

const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927a1 1 0 011.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969
    0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755
    1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07
    -3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0
    00.951-.69l1.07-3.292z" />
  </svg>
);

export default function Reviews() {
  return (
    <section className="bg-muted py-10 sm:py-15">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          What Our <span className="bg-yellow-400 px-2 mb-2">Happy</span> <br />
          Users Say
        </h2>
        <p className="mt-2 text-lg leading-8 text-slate-600 py-4"> 
          Thousands of professionals have landed their dream jobs with Resumind.
        </p>
      </div>
      <div className="relative w-full max-w-7xl mx-auto overflow-hidden flex items-center py-4">
        <div className="items-center gap-8 md:justify-start [&>div]:mx-1 flex animate-scroll min-w-max">
          {([...reviews, ...reviews]).map((review, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[420px] sm:w-[500px] md:h-[180px] p-5 bg-white rounded-[28px] shadow-lg border border-gray-100 flex flex-col justify-between snap-start snap-always scroll-m-5 first-of-type:scroll-m-10 transition-all"
            >
              <blockquote className="mb-1 text-gray-700 text-sm font-medium leading-relaxed">
                {review.quote}
              </blockquote>
              {/* Bottom section dengan user info dan stars */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Image 
                    className="rounded-full object-cover" 
                    src={review.avatar} 
                    alt={review.name} 
                    width={36} 
                    height={36} 
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 text-sm truncate">
                      {review.name}
                    </div>
                    <div className="text-slate-500 text-xs truncate">
                      {review.title}
                    </div>
                  </div>
                </div>
                
                {/* Stars dengan fixed width */}
                <div className="flex gap-0.5 ml-4 flex-shrink-0">
                  {[...Array(5)].map((_, i) =>
                    <StarIcon key={i} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
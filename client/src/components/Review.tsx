"use client";
import React from 'react';
import Image from 'next/image';

const reviews = [
  {
    quote: "Resumind completely changed my job search. The ATS analysis helped me get past the bots and in front of real recruiters. Landed a new role in 3 weeks!",
    name: "Sarah L.",
    title: "Marketing Manager",
    avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=SL",
  },
  {
    quote: "As a developer, I know code, not keywords. This tool was a lifesaver. It pinpointed exactly what my resume was missing for the jobs I wanted.",
    name: "David Chen",
    title: "Software Engineer",
    avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=DC",
  },
  {
    quote: "I was stuck in a career rut. Resumind's feedback gave me the confidence to apply for senior roles. The pro plan is worth every penny.",
    name: "Maria Garcia",
    title: "Senior Accountant",
    avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=MG",
  },
  {
    quote: "The interface is so clean and easy to use. I got an 88% match score on my dream job application and got the interview!",
    name: "James T.",
    title: "UX Designer",
    avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=JT",
  }
];

const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);


export default function Reviews() {
  return (
    <section className="bg-muted py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">What Our Happy Users Say</h2>
          <p className="mt-2 text-lg leading-8 text-slate-600">
            Thousands of professionals have landed their dream jobs with Resumind.
          </p>
        </div>
      </div>

      <div className="mt-16 w-full overflow-hidden">
        <div className="flex animate-scroll group-hover:pause">
          {[...reviews, ...reviews].map((review, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-80 sm:w-96 mx-4 p-8 rounded-2xl bg-background shadow-xl border border-transparent transition-all duration-300 hover:scale-105 hover:border-primary-light"
            >
              <div className="flex items-center gap-x-4">
                <Image className="h-12 w-12 rounded-full bg-gray-200 object-cover" 
                src={review.avatar} 
                alt={`Avatar of ${review.name}`} 
                width={48} 
                height={48}
                unoptimized={true} 
                />
                <div>
                  <div className="text-lg font-semibold text-foreground">{review.name}</div>
                  <div className="text-primary-light font-medium">{review.title}</div>
                </div>
              </div>
              <p className="mt-6 text-base leading-7 text-slate-700">“{review.quote}”</p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
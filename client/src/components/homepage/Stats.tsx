"use client";
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const statsData = [
  { value: 456, label: 'People have tried our resume analyzer' },
  { value: 56, label: 'HR staff searched through the contact library today' },
  { value: 5, label: 'Average time to create a job profile', suffix: ' minute' },
];

const Stats = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });
    const [startCount, setStartCount] = useState(false);

    useEffect(() => {
        if (inView) {
            setStartCount(true);
        }
    }, [inView]);

    return (
        <section ref={ref} className="bg-[#162B60] py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {statsData.map((stat, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                            <h2 className="text-5xl font-bold text-blue-900">
                               {startCount && <CountUp end={stat.value} duration={2.5} suffix={stat.suffix || ''} />}
                            </h2>
                            <p className="mt-3 text-slate-700">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
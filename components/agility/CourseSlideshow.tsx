'use client';

import { useState, useEffect } from 'react';

const courses = [
  {
    name: '4-Cone Square',
    description: 'Standard 10m × 10m square layout',
    svg: (
      <svg viewBox="0 0 300 300" className="w-full h-auto">
        <rect width="300" height="300" fill="#f9fafb" rx="8" />
        <circle cx="150" cy="150" r="10" fill="#4f46e5" stroke="#312e81" strokeWidth="2" />
        <text x="150" y="155" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">START</text>
        <line x1="150" y1="150" x2="150" y2="70" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx="150" cy="70" r="16" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <text x="150" y="75" textAnchor="middle" fontSize="16" fill="#000" fontWeight="bold">1</text>
        <text x="150" y="102" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="600">10m</text>
        <line x1="150" y1="150" x2="230" y2="150" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx="230" cy="150" r="16" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <text x="230" y="155" textAnchor="middle" fontSize="16" fill="#000" fontWeight="bold">2</text>
        <text x="230" y="182" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="600">10m</text>
        <line x1="150" y1="150" x2="150" y2="230" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx="150" cy="230" r="16" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <text x="150" y="235" textAnchor="middle" fontSize="16" fill="#000" fontWeight="bold">3</text>
        <text x="150" y="262" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="600">10m</text>
        <line x1="150" y1="150" x2="70" y2="150" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx="70" cy="150" r="16" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <text x="70" y="155" textAnchor="middle" fontSize="16" fill="#000" fontWeight="bold">4</text>
        <text x="70" y="182" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="600">10m</text>
        <text x="150" y="290" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="600">4-Cone Square</text>
      </svg>
    ),
  },
  {
    name: '3-Cone Triangle',
    description: 'Equilateral triangle with 8m sides',
    svg: (
      <svg viewBox="0 0 300 300" className="w-full h-auto">
        <rect width="300" height="300" fill="#f9fafb" rx="8" />
        <circle cx="150" cy="150" r="10" fill="#4f46e5" stroke="#312e81" strokeWidth="2" />
        <text x="150" y="155" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">START</text>
        <line x1="150" y1="150" x2="150" y2="80" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx="150" cy="80" r="16" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <text x="150" y="85" textAnchor="middle" fontSize="16" fill="#000" fontWeight="bold">1</text>
        <text x="150" y="112" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="600">8m</text>
        <line x1="150" y1="150" x2="220" y2="220" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx="220" cy="220" r="16" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <text x="220" y="225" textAnchor="middle" fontSize="16" fill="#000" fontWeight="bold">2</text>
        <text x="220" y="252" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="600">8m</text>
        <line x1="150" y1="150" x2="80" y2="220" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx="80" cy="220" r="16" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <text x="80" y="225" textAnchor="middle" fontSize="16" fill="#000" fontWeight="bold">3</text>
        <text x="80" y="252" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="600">8m</text>
        <text x="150" y="290" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="600">3-Cone Triangle</text>
      </svg>
    ),
  },
  {
    name: '5-Cone Pentagon',
    description: 'Pentagon shape with 9m radius',
    svg: (
      <svg viewBox="0 0 300 300" className="w-full h-auto">
        <rect width="300" height="300" fill="#f9fafb" rx="8" />
        <circle cx="150" cy="150" r="10" fill="#4f46e5" stroke="#312e81" strokeWidth="2" />
        <text x="150" y="155" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">START</text>
        <line x1="150" y1="150" x2="150" y2="70" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx="150" cy="70" r="16" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <text x="150" y="75" textAnchor="middle" fontSize="16" fill="#000" fontWeight="bold">1</text>
        <text x="150" y="102" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="600">9m</text>
        <line x1="150" y1="150" x2="226" y2="103" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx="226" cy="103" r="16" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <text x="226" y="108" textAnchor="middle" fontSize="16" fill="#000" fontWeight="bold">2</text>
        <text x="226" y="135" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="600">9m</text>
        <line x1="150" y1="150" x2="198" y2="215" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx="198" cy="215" r="16" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <text x="198" y="220" textAnchor="middle" fontSize="16" fill="#000" fontWeight="bold">3</text>
        <text x="198" y="247" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="600">9m</text>
        <line x1="150" y1="150" x2="102" y2="215" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx="102" cy="215" r="16" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <text x="102" y="220" textAnchor="middle" fontSize="16" fill="#000" fontWeight="bold">4</text>
        <text x="102" y="247" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="600">9m</text>
        <line x1="150" y1="150" x2="74" y2="103" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx="74" cy="103" r="16" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
        <text x="74" y="108" textAnchor="middle" fontSize="16" fill="#000" fontWeight="bold">5</text>
        <text x="74" y="135" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="600">9m</text>
        <text x="150" y="290" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="600">5-Cone Pentagon</text>
      </svg>
    ),
  },
];

export default function CourseSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % courses.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Official Course Layouts</h3>
      
      {/* Slideshow */}
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {courses.map((course, index) => (
              <div key={index} className="w-full shrink-0">
                <div className="max-w-sm mx-auto">
                  {course.svg}
                  <p className="text-center text-sm text-gray-600 mt-2">{course.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {courses.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-indigo-600 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
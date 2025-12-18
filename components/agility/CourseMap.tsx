'use client';

import type { AgilityCourse } from '@/lib/types/agility.types';

interface CourseMapProps {
  course: AgilityCourse;
  showDistances?: boolean;
  compact?: boolean;
  className?: string;
}

export default function CourseMap({ 
  course, 
  showDistances = true, 
  compact = false,
  className = ''
}: CourseMapProps) {
  const size = compact ? 200 : 300;
  const center = size / 2;
  const maxDistance = Math.max(...course.cone_positions.map(p => p.distance));
  const scale = (size * 0.4) / maxDistance; // Leave margin

  return (
    <svg 
      viewBox={`0 0 ${size} ${size}`} 
      className={className}
      style={{ maxWidth: size, maxHeight: size }}
    >
      {/* Background */}
      <rect width={size} height={size} fill="#f9fafb" rx="8" />
      
      {/* Center point (start position) */}
      <circle 
        cx={center} 
        cy={center} 
        r="8" 
        fill="#4f46e5" 
        stroke="#312e81"
        strokeWidth="2"
      />
      <text 
        x={center} 
        y={center + 4} 
        textAnchor="middle" 
        fontSize={compact ? "10" : "12"}
        fill="white"
        fontWeight="bold"
      >
        START
      </text>

      {/* Cones */}
      {course.cone_positions.map(cone => {
        const angleRad = (cone.angle * Math.PI) / 180;
        const x = center + cone.distance * scale * Math.cos(angleRad);
        const y = center + cone.distance * scale * Math.sin(angleRad);

        return (
          <g key={cone.number}>
            {/* Distance line */}
            <line
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#d1d5db"
              strokeWidth="1"
              strokeDasharray="4,4"
            />

            {/* Cone */}
            <circle 
              cx={x} 
              cy={y} 
              r={compact ? "12" : "16"} 
              fill="#fbbf24"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            
            {/* Cone number */}
            <text 
              x={x} 
              y={y + (compact ? 4 : 5)} 
              textAnchor="middle" 
              fontSize={compact ? "12" : "16"}
              fill="#000"
              fontWeight="bold"
            >
              {cone.number}
            </text>

            {/* Distance label */}
            {showDistances && (
              <text
                x={x}
                y={y + (compact ? 24 : 32)}
                textAnchor="middle"
                fontSize={compact ? "10" : "12"}
                fill="#6b7280"
                fontWeight="600"
              >
                {cone.distance}m
              </text>
            )}
          </g>
        );
      })}

      {/* Course name */}
      <text
        x={center}
        y={size - 10}
        textAnchor="middle"
        fontSize={compact ? "10" : "12"}
        fill="#6b7280"
        fontWeight="600"
      >
        {course.name}
      </text>
    </svg>
  );
}


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'motion/react';

interface RadarChartProps {
  data: { label: string; value: number }[];
  size?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size = 300 }) => {
  const padding = 40;
  const radius = (size - padding * 2) / 2;
  const centerX = size / 2;
  const centerY = size / 2;
  const maxValue = 5;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    const r = (radius * value) / maxValue;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  };

  const points = data.map((d, i) => {
    const coords = getCoordinates(i, d.value);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  // Grid levels
  const levels = [1, 2, 3, 4, 5];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="radar-chart-svg">
      {/* Grid circles */}
      {levels.map(level => (
        <circle
          key={level}
          cx={centerX}
          cy={centerY}
          r={(radius * level) / maxValue}
          fill="none"
          stroke="rgba(64, 224, 208, 0.1)"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {data.map((d, i) => {
        const coords = getCoordinates(i, maxValue);
        return (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={coords.x}
            y2={coords.y}
            stroke="rgba(64, 224, 208, 0.1)"
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygon */}
      <motion.polygon
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        points={points}
        fill="rgba(45, 212, 191, 0.3)"
        stroke="#2dd4bf"
        strokeWidth="2"
      />

      {/* Labels */}
      {data.map((d, i) => {
        const coords = getCoordinates(i, maxValue + 0.6);
        return (
          <motion.text
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            x={coords.x}
            y={coords.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="10px"
            fontWeight="600"
          >
            {d.label}
          </motion.text>
        );
      })}
    </svg>
  );
};

export default RadarChart;


import React from 'react';

interface SectionBadgeProps {
  icon: string;
  text: string;
  gradientColors: string;
  borderColor: string;
  textColor: string;
}

const SectionBadge: React.FC<SectionBadgeProps> = ({
  icon,
  text,
  gradientColors,
  borderColor,
  textColor
}) => {
  return (
    <div className={`inline-block px-4 py-2 bg-gradient-to-r ${gradientColors} border ${borderColor} rounded-full ${textColor} text-sm font-medium backdrop-blur-sm mb-6`}>
      {icon} {text}
    </div>
  );
};

export default SectionBadge;

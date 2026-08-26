import React from 'react';

export const OrangeLogo: React.FC<{ size?: 'sm' | 'md' | 'lg', showText?: boolean, className?: string }> = ({ 
  size = 'md', 
  showText = true,
  className = ''
}) => {
  const squareSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Orange square with official Orange curve highlight */}
      <div className={`${squareSizes[size]} bg-[#ff7900] flex items-center justify-center relative overflow-hidden rounded-none shadow-sm flex-shrink-0`}>
        <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-[#ff9838] rounded-full opacity-60 pointer-events-none" />
      </div>
      {showText && (
        <span className={`font-extrabold tracking-tight text-white ${textSizes[size]}`}>
          orange<span className="text-[#ff7900]">™</span>
        </span>
      )}
    </div>
  );
};

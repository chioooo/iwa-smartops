import React from "react";

type Props = {
    text: string;
    children: React.ReactNode;
};

export function Tooltip({text, children}: Props) {
    return (
        <div className="relative group inline-block">
            {children}

            <div className="
        absolute left-1/2 -translate-x-1/2 -top-10
        whitespace-nowrap
        bg-gray-800 text-white text-xs px-2 py-1 rounded-md
        opacity-0 group-hover:opacity-100
        scale-95 group-hover:scale-100
        transition-all duration-150
        pointer-events-none
        shadow-lg
        z-50
      ">
                {text}

                {/* Triangulito */}
                <div className="
          absolute top-full left-1/2 -translate-x-1/2
          w-0 h-0
          border-l-4 border-r-4 border-t-4
          border-l-transparent border-r-transparent border-t-gray-800
          z-50
        "/>
            </div>
        </div>
    );
}

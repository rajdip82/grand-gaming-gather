
import React, { useState } from "react";
import Spline from '@splinetool/react-spline';
import ErrorBoundary from './ErrorBoundary';

interface SplineSceneProps {
  sceneUrl?: string;
  className?: string;
}

// Your Spline scene URL, example placeholder (MUST be a direct .splinecode link!)
const DEFAULT_SCENE = ""; // Set your direct .splinecode file link here!

const SplineScene = ({ sceneUrl = DEFAULT_SCENE, className = "" }: SplineSceneProps) => {
  const [hasError, setHasError] = useState(false);

  // Don't render if no URL or error occurred
  if (!sceneUrl || hasError) return null;

  return (
    <ErrorBoundary
      fallback={
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-red-800/80 text-white px-6 py-4 rounded-xl shadow-lg font-bold max-w-xs mx-auto text-center">
            Sorry, the 3D scene couldn&apos;t be loaded.
          </div>
        </div>
      }
    >
      <div className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}>
        <Spline
          scene={sceneUrl}
          onError={() => setHasError(true)}
        />
      </div>
    </ErrorBoundary>
  );
};

export default SplineScene;


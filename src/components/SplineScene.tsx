
import React, { useState } from "react";
import Spline from '@splinetool/react-spline';

interface SplineSceneProps {
  sceneUrl?: string;
  className?: string;
}

// WARNING: This URL returns 403 (Access Denied) and causes a fatal error in Spline's runtime.
// Please upload your own Spline scene and paste a working public .splinecode URL here.
const DEFAULT_SCENE = "";

// This component will render nothing if Spline fails to load.
const SplineScene = ({ sceneUrl = DEFAULT_SCENE, className = "" }: SplineSceneProps) => {
  const [hasError, setHasError] = useState(false);

  // Don't render if no URL or error occurred
  if (!sceneUrl || hasError) return null;

  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}>
      <Spline
        scene={sceneUrl}
        onError={() => setHasError(true)}
      />
      {/* If you want to debug error state, uncomment below: */}
      {/* hasError && <div className="absolute top-4 left-4 bg-red-600 text-white p-2 rounded">Error loading 3D scene</div> */}
    </div>
  );
};

export default SplineScene;

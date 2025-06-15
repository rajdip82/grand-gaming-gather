
import React, { useState } from "react";
import Spline from '@splinetool/react-spline';

interface SplineSceneProps {
  sceneUrl?: string;
  className?: string;
}

// Your Spline scene URL
const DEFAULT_SCENE = "https://my.spline.design/worldplanet-TFDO98UA1NOkiYYX8hV6WN9w/";

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


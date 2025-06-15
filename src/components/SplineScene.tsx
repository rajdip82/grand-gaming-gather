
import Spline from '@splinetool/react-spline';

interface SplineSceneProps {
  sceneUrl?: string;
  className?: string;
}

const DEFAULT_SCENE = "https://prod.spline.design/Z4B1v1xqStPwHv7UseC6GhD3wC5dyYJJ/scene.splinecode"; // This is just a sample scene

const SplineScene = ({ sceneUrl = DEFAULT_SCENE, className = "" }: SplineSceneProps) => {
  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}>
      <Spline scene={sceneUrl} />
    </div>
  );
};

export default SplineScene;


import { AppleHelloEnglishEffect } from "@/components/ui/apple-hello-effect";
import { Component as VapourTextEffect } from "@/components/ui/vapour-text-effect";

const AppleHelloEffectDemo = () => {
  return (
    <div className="flex w-full h-screen flex-col justify-center items-center gap-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to Proxycorn Tournaments</h1>
        <p className="text-gray-300 mb-8">Experience the magic of competitive gaming</p>
        <AppleHelloEnglishEffect 
          speed={1.1} 
          className="text-purple-400 mx-auto"
          onAnimationComplete={() => console.log("Hello animation completed!")}
        />
      </div>
    </div>
  );
};

const VapourTextEffectDemo = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <VapourTextEffect />
    </div>
  );
};

const DemoOne = () => {
  return <AppleHelloEffectDemo />;
};

const DemoTwo = () => {
  return <VapourTextEffectDemo />;
};

export { DemoOne, DemoTwo, AppleHelloEffectDemo, VapourTextEffectDemo };

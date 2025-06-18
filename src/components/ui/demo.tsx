
import { AppleHelloEnglishEffect } from "@/components/ui/apple-hello-effect";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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

const DefaultToggle = () => {
  return (
    <div className="space-y-2 text-center">
      <div className="flex justify-center">
        <ThemeToggle />
      </div>
    </div>
  );
};

const DemoOne = () => {
  return <AppleHelloEffectDemo />;
};

export { DemoOne, AppleHelloEffectDemo, DefaultToggle };

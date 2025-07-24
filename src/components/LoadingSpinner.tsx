// components/LoadingSpinner.tsx
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <Loader2 className="animate-spin w-10 h-10 text-primary" />
    </div>
  );
};

export default LoadingSpinner;

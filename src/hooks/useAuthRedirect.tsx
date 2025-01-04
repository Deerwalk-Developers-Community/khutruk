import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "./use-toast";

const useAuthRedirect = (url?: string) => {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");

    if (!isAuthenticated) {
      if (!["/login", "/register"].includes(pathname)) {
        toast({
          title: "No Logged In User",
          description: "Redirecting to login...",
        });
        router.push("/login");
      }
    } else {
      if (["/login", "/register"].includes(pathname)) {
        toast({
          title: "Already Logged In",
          description: "Redirecting to dashboard...",
        });
        router.push("/dashboard");
      } else if (url) {
        // Optionally redirect to a specific URL if provided
        router.push(url);
      }
    }
  }, [pathname, router]);
};

export default useAuthRedirect;
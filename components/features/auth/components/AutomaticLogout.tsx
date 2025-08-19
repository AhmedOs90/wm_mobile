import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import {useIdleTimer} from "react-idle-timer";
import { authStorage } from "@/lib/authStorage";
import {useEffect, useState, useRef} from "react";

const AutomaticLogout = ({translations}: {translations: any}) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { toast } = useToast();
    const warningTimeout = 1000 * 60 * 55 ; // 55 minutes
    const { logout } = useAuthContext()
    
    
    const handleOnIdle = () => {
    if (isLoggingOut || !authStorage.getToken()) return; 

    setIsLoggingOut(true);

    toast({
        title: translations.common?.autoLogout || "Auto Logout",
        description: translations.common?.inactivityWarning || "Logging out in 10 seconds due to inactivity",
        variant: "destructive"
    })



    timeoutRef.current = setTimeout( async () => {
      await logout();
    }, 10 * 1000); // 10 seconds
  };


  useEffect(() => {
    return () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }
  }, []);

     useIdleTimer({
    timeout: warningTimeout,
    onIdle: handleOnIdle,
    debounce: 500,
  });

  return null;
}; 

export default AutomaticLogout;

// useNotificationChecker.ts
import { useEffect } from 'react';

const useNotificationChecker = () => {
  useEffect(() => {
    const checkNotifications = async () => {
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          registration.active?.postMessage({ action: 'check-notifications' });
        }
      } catch (error) {
        console.error('Error checking notifications:', error);
      }
    };

    checkNotifications();

    // Add this if you want to check for notifications at a specific interval
    const interval = setInterval(checkNotifications, 60000); // Check every minute

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);
};

export default useNotificationChecker;
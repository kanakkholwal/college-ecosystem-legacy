// public/notifications-worker.js

self.addEventListener("message", async (event) => {
  if (event.data.action === "check-notifications") {
    try {
      // const response = await fetch('/api/notifications');
      // const notifications = await response.json();
      // if (notifications.length > 0) {
      //   notifications.forEach((notification) => {
      //     self.registration.showNotification(notification.title, {
      //       body: notification.body,
      //       icon: '/favicon.ico', // Replace with your desired icon path
      //       data: {
      //         url: notification.url,
      //       },
      //     });
      //   });
      // }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }
});

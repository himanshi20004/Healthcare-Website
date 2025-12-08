import fetch from "node-fetch";

setInterval(async () => {
  try {
    await fetch("http://localhost:3000/api/send-remainder");
    console.log("Reminder check triggered at", new Date().toLocaleTimeString());
  } catch (error) {
    console.error("Error triggering reminder:", error);
  }
}, 60 * 1000); // every 1 minute

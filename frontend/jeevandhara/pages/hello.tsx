import { useEffect, useState } from "react";

export default function HelloPage() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function fetchMessage() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/hello");
        const data: { message: string } = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    }

    fetchMessage();
  }, []);

  return (
    <div>
      <h1>Backend Message</h1>
      <p>{message}</p>
    </div>
  );
}

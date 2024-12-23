import { useState, useEffect } from "react";

const DateTime = () => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const date = new Date();
      setTime(formatTime(date));
    };

    const formatTime = (date) => {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();

      hours = formatZero(hours);
      minutes = formatZero(minutes);
      seconds = formatZero(seconds);

      return `${hours}:${minutes}:${seconds}`;
    };

    const formatZero = (time) => {
      time = time.toString();
      return time.length < 2 ? "0" + time:time;
    };

    const date = new Date();
    setDate(date.toDateString());

    update();
    const intervalId = setInterval(update, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-center text-sm text-gray-600 flex-shrink-0">
      <span>{date}</span>
      <span className="mx-2">|</span>
      <span>{time}</span>
    </div>
  );
};

export default DateTime;

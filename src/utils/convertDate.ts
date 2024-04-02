const convertDate = (dateUTC: string) => {
  const localDate = new Date(dateUTC);
  const time = localDate.toLocaleString("default", {
    hour: "2-digit",
    minute: "numeric",
    hour12: false,
  });
  const dayMonth = localDate.toLocaleString("default", {
    day: "numeric",
    month: "long",
  });
  return { time, dayMonth };
};

export default convertDate;

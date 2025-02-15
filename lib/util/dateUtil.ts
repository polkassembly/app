function getFormattedDateTime(date: Date): string {

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Get ordinal suffix for the day
  const getOrdinal = (n: number): string => {
    if (n > 3 && n < 21) return "th"; // Covers 4th-20th
    const suffixes = ["st", "nd", "rd"];
    return suffixes[(n % 10) - 1] || "th";
  };

  return `${day}${getOrdinal(day)} ${month}, ${hours}:${minutes}`;
}

export { getFormattedDateTime };
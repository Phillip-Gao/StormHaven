export function formatDate(date) {
  const dateObj = new Date(Date.parse(date.substring(0, 10)));
  return dateObj.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function exportDate(date) {
  
}
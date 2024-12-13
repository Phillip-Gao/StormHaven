export function formatDate(date) {
  const dateObj = new Date(Date.parse(date.substring(0, 10)));
  return dateObj.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function exportDate(date, max) {
  if (date.length != 0 && !max) {
    return date + "T00:00:00.000Z";
  } else if (date.length != 0 && max) {
    return date + "T23:59:00.000Z";
  }
  return "";
}

export function formatStatus(status) {
  return status.replace("_", " ")
}
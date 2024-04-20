export const formatDate = (date) => {
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const formattedDate = new Date(date).toLocaleDateString("en-GB", options);

  return formattedDate;
};

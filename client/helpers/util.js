export const stripTimeFromDate = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

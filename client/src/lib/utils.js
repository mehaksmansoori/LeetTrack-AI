export const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(value || 0);

export const formatDelta = (value) => {
  if (value > 0) {
    return `+${value}`;
  }

  return `${value || 0}`;
};

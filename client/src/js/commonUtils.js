export const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const emptyCheck = value => {
  if (!value || value.trim() === '') {
    return false;
  } else {
    return true;
  }
};

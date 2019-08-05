function confine(num, min, max) {
  // Confines number 'num' between 'min' and 'max'
  if (num <= min) return min;
  if (num >= max) return max;
  return num;
}

module.exports = confine;

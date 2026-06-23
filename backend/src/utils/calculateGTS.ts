export const calculateGTS = (dr: number, cf: number, pi: number, dh: number, iv: number): number => {
  return Math.round(0.4 * dr + 0.3 * cf + 0.15 * pi + 0.1 * dh + 0.05 * iv);
};

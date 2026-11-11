// WBBL tournament page data, copied from the original's /marketprovider/events/detail/28045743
// back/lay: best price first, as [price, size]; the page shows back worst -> best, lay best -> worst.

export const WBBL_EVENT = {
  id: 'wbbl-28045743',
  title: 'WBBL - Winner',
  openDate: '2024-12-01T07:10:00Z',
  min: 1,
  max: 1,
};

export const WBBL_WINNER = {
  name: 'Winner 2026',
  min: '1.00',
  max: '1.00',
  runners: [
    { name: 'Hobart Hurricanes W', back: [[50, 1.03], [40, 103.07], [2.82, 9.82]], lay: [[990, 5]] },
    { name: 'Sydney Sixers W', back: [[2.86, 271.46], [1.42, 19.51], [1.39, 12.82]], lay: [[2.88, 534.72], [4.3, 5.78], [4.4, 4.81]] },
    { name: 'Perth Scorchers W', back: [[3.25, 242.21], [1.81, 850.82], [1.39, 12.82]], lay: [[5, 5.54], [5.3, 8.68], [5.5, 1.01]] },
    { name: 'Melbourne Stars W', back: [[21, 4], [20, 2.58], [19, 154.6]], lay: [[990, 4.46]] },
    { name: 'Sydney Thunder W', back: [[7, 206.94], [2.22, 12.48], [1.54, 982]], lay: [[10.5, 154.6], [42, 1.16], [990, 5.81]] },
    { name: 'Adelaide Strikers W', back: [[13.5, 1.84], [13, 3], [12.5, 4.12]], lay: [[940, 2.14], [990, 5]] },
    { name: 'Melbourne Renegades W', back: [[11.5, 10], [11, 4.68], [10, 2.7]], lay: [[1000, 3.02]] },
    { name: 'Brisbane Heat W', back: [[11.5, 4], [11, 257.57], [2.82, 9.82]], lay: [[960, 5.37]] },
  ],
};

export const WBBL_BOOKMAKER = {
  name: 'WBBL 2026 Winner Cup Bookmaker',
  min: '100.00',
  max: '25000.00',
  runners: [
    { name: 'Hobart Hurricanes W', back: [900, 899, 898] },
    { name: 'Sydney Sixers W', back: [110, 109, 108] },
    { name: 'Perth Scorchers W', back: [90, 89, 88], suspended: true },
    { name: 'Melbourne Stars W', back: [900, 899, 898] },
    { name: 'Sydney Thunder W', back: [350, 349, 348], suspended: true },
    { name: 'Adelaide Strikers W', back: [550, 549, 548] },
    { name: 'Melbourne Renegades W', back: [450, 449, 448] },
    { name: 'Brisbane Heat W', back: [600, 599, 598] },
  ],
};

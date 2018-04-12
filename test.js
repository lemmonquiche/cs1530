var defaultCells = [
  /* dis  mon    tues   wed    thurs  fri    sat    sun */
  [false, false, false, false, false, false, false, false],  // 8
  [false, false, false, false, false, false, false, false],  // 830
  [false, false, false, false, false, false, false, false],  // 9
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 10
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 11
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 12
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 13
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 2
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 3
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 4
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 5
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 6
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 7
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 8
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 9
  [false, false, false, false, false, false, false, false],
];

function adaptArray() {
  return defaultCells.slice(1)map(function (row) {
    return row.slice(1).map(function (value) {
      return value ? '1' : '0';
    });
  });
}

console.log(adaptArray(defaultCells));

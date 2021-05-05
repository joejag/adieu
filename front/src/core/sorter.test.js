import {
  within,
  todayRange,
  yesterdayRange,
  monthRange,
  beforeMonthRange,
} from './sorter'

const date = (year, month, day) => {
  return new Date(Date.UTC(year, month - 1, day))
}

test('within', () => {
  expect(
    within({
      from: date(2021, 4, 1),
      to: date(2021, 4, 30),
      candidate: date(2021, 5, 1),
    })
  ).toBe(false)

  expect(
    within({
      from: date(2021, 4, 1),
      to: date(2021, 4, 30),
      candidate: date(2021, 4, 10),
    })
  ).toBe(true)
})

test('today range', () => {
  expect(todayRange(date(2021, 4, 30))).toEqual({
    from: date(2021, 4, 30),
    to: date(2021, 5, 1),
  })
})

test('yesterday range', () => {
  expect(yesterdayRange(date(2021, 4, 30))).toEqual({
    from: date(2021, 4, 29),
    to: date(2021, 4, 30),
  })
})

test('this month', () => {
  expect(monthRange(date(2021, 4, 29))).toEqual({
    from: date(2021, 4, 1),
    to: date(2021, 4, 30),
  })
})

function partition(array, isValid) {
  return array.reduce(
    ([pass, fail], elem) => {
      return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]]
    },
    [[], []]
  )
}

// const [pass, fail] = partition(myArray, (e) => e > 5)

export { partition }

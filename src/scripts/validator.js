const validateTo = (rule, value, callback) => {
  if (value < this.ladder.from) {
    callback(new Error('Cannot be smaller than FROM value'))
  } else {
    callback()
  }
}

const validatePrice = (rule, value, callback) => {
  if (value < this.ladder.from) {
    callback(new Error('Cannot be smaller than FROM value'))
  } else {
    callback()
  }
}

const validateQuantity = (rule, value, callback) => {
  if (value < this.ladder.from) {
    callback(new Error('Cannot be smaller than FROM value'))
  } else {
    callback()
  }
}

const validateAcquaintance = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Please enter a number'))
  }
  value = Number(value)
  if (typeof value === 'number' && !isNaN(value)) {
    if (value < 1) {
      callback(new Error('Pallet number cannot be smaller than 1'))
    } else {
      callback()
    }
  } else {
    callback(new Error('Please enter valid pallet number'))
  }
}

export default { validateTo, validatePrice, validateQuantity, validateAcquaintance }

export function validateNumber(num) {
  alert(num)
  return (rule, value, callback) => {
    if (value < num) {
      callback(new Error('Cannot be smaller than FROM value'))
    } else {
      callback()
    }
  }
}

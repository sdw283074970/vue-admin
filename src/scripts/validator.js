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

export function correctNumber(model, name, max, min) {
  if (!model[name]) {
    model[name] = 0
  }

  if (model[name] === '-') {
    model[name] = '-'
  }

  let arg_max = ''
  let arg_min = ''

  arg_max = parseFloat(max)
  arg_min = parseFloat(min)

  if (model[name] > arg_max) {
    model[name] = arg_max
  }
  if (model[name] < arg_min) {
    model[name] = arg_min
  }

  model[name] = parseFloat(model[name]).toFixed(0) // 默认保留至整数
}

// import { formatDate } from '@/scripts/formatDate'

const schedulePickerOptions = {
  shortcuts: [{
    text: 'Today',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      picker.$emit('pick', [start, end])
    }
  }, {
    text: 'Tomorrow',
    onClick(picker) {
      const start = new Date()
      start.setTime(start.getTime() + 3600 * 1000 * 24)
      picker.$emit('pick', [start, start])
    }
  }, {
    text: 'Next 7 days',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() + 3600 * 1000 * 24)
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: 'Next 30 days',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() + 3600 * 1000 * 24)
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: 'Last 3 months',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: 'Last year',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: 'Last 3 years',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 3)
      picker.$emit('pick', [start, end])
    }
  }]
}

export { schedulePickerOptions }

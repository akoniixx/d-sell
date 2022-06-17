export class DateTimeUtil {
    static getTimestampSecond(dt: Date): number {
      return Math.floor(dt.getTime() / 1000)
    }
  
    static formatDateTh = (date: string) => {
      const formatDate = new Date(date)
      return formatDate.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
  
    static formatTime = (date: string) => {
      const formatTime = new Date(date)
      return formatTime.toLocaleTimeString('th-TH', {
        hour: 'numeric',
        minute: 'numeric',
      })
    }
  }
  
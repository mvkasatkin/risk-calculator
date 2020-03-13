export class Calculator {
  calc(inpRisk, inpPrice, inpStop, inpLot, inpCommission) {
    const risk = parseFloat(inpRisk) || 0
    const price = parseFloat(inpPrice) || 0
    const stop = parseFloat(inpStop) || 0
    const lot = parseFloat(inpLot) || 1
    const commission = parseFloat(inpCommission) || 0

    const result = { lots: 0, money: 0 }

    if (price && stop && risk) {
      const diff = Math.abs(price - stop)
      const percent = diff / price * 100 - commission * 2
      const money = risk / percent * 100
      const volume = Math.floor(money / price)
      const lots = Math.floor(volume / lot)
      result.lots = lots
      result.money = lots * lot * price
    }

    return result
  }
}

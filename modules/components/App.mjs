// noinspection JSFileReferences
import { html, useState } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { Calculator } from '../lib/Calculator.mjs'

const calculator = new Calculator()

export const App = () => {
  const [lot, setLot] = useState('1')
  const [risk, setRisk] = useState(localStorage.getItem('risk') || '')
  const [stop, setStop] = useState('')
  const [price, setPrice] = useState('')
  const [commission, setCommission] = useState('0')

  const { money, lots } = calculator.calc(risk, price, stop, lot, commission)

  const updateRisk = (v) => {
    localStorage.setItem('risk', v)
    setRisk(v)
  }

  return html`
    <div class="app">
      <h1 class="title">Калькулятор риска</h1>

      <div class="row">
        <div class="cell">
          <div class="label">Цена акции</div>
          <input autofocus class="input" type="number" value=${price} onInput=${e => setPrice(e.target.value)} />
        </div>
        <div class="cell">
          <div class="label">Цена stop loss</div>
          <input class="input" type="number" value=${stop} onInput=${e => setStop(e.target.value)} />
        </div>
      </div>

      <div class="row">
        <div class="cell">
          <div class="label">Допустимый риск</div>
          <input class="input" type="phone" value=${risk} onInput=${e => updateRisk(e.target.value)} />
        </div>
        <div class="cell">
          <div class="label">Лот</div>
          <input class="input" type="number" value=${lot} onInput=${e => setLot(e.target.value)} />
        </div>
      </div>

      <div class="result">
        <div>Money: <span class="result__value">${money}</span></div>
        <div>Lots: <span class="result__value">${lots}</span></div>
      </div>
    </div>
  `
}

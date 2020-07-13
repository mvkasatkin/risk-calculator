// noinspection JSFileReferences
import { html, useState } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { Calculator } from '../lib/Calculator.mjs'

const calculator = new Calculator()

export const App = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '')
  const [ticker, setTicker] = useState('')
  const [lot, setLot] = useState('1')
  const [risk, setRisk] = useState(localStorage.getItem('risk') || '')
  const [stop, setStop] = useState('')
  const [price, setPrice] = useState('')
  const [commission, setCommission] = useState('0')

  const { money, lots } = calculator.calc(risk, price, stop, lot, commission)

  const updateApiKey = (v) => {
    localStorage.setItem('apiKey', v)
    setApiKey(v)
  }

  const updateTicker = (v) => {
    const ticker = v.toUpperCase()
    setTicker(ticker)
  }

  const blurTicker = () => {
    if (apiKey && ticker) {
      fetchPrice(ticker, apiKey).then(price => {
        price && setPrice(price)
      }).catch(console.error)
    }
  }

  const updateRisk = (v) => {
    localStorage.setItem('risk', v)
    setRisk(v)
  }

  const updatePrice = (v) => {
    setPrice(`${parseFloat(v.replace(',', '.').replace('б', '.').replace('ю', '.'))}`)
  }

  const updateStop = (v) => {
    setStop(`${parseFloat(v.replace(',', '.').replace('б', '.').replace('ю', '.'))}`)
  }

  return html`
    <div class="app">
      <h1 class="title">Калькулятор риска</h1>

      <div class="row">
        <div class="cell">
          <div class="label">API KEY</div>
          <input autofocus class="input" type="text" value=${apiKey} onInput=${e => updateApiKey(e.target.value)} />
        </div>
        <div class="cell">
          <div class="label">Тикер</div>
          <input tabindex="1" class="input" type="text" value=${ticker} onchange=${e => updateTicker(e.target.value)} onblur=${blurTicker} />
        </div>
      </div>

      <div class="row">
        <div class="cell">
          <div class="label">Цена акции</div>
          <input autofocus class="input" type="text" value=${price} onInput=${e => updatePrice(e.target.value)} />
        </div>
        <div class="cell">
          <div class="label">Цена stop loss</div>
          <input tabindex="2" class="input" type="text" value=${stop} onInput=${e => updateStop(e.target.value)} />
        </div>
      </div>

      <div class="row">
        <div class="cell">
          <div class="label">Допустимый риск</div>
          <input tabindex="3" class="input" type="phone" value=${risk} onInput=${e => updateRisk(e.target.value)} />
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

async function fetchPrice(ticker, apiKey) {
  const url = 'https://api-invest.tinkoff.ru/openapi'

  const opts = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
  }
  const response1 = await (await fetch(`${url}/market/search/by-ticker?ticker=${ticker}`, opts)).json()
  if (response1 && response1.payload && response1.payload.instruments) {
    const instrument = response1.payload.instruments[0]
    const figi = instrument.figi
    const to = new Date().toISOString()
    const from = new Date(Date.now() - 86400 * 10000).toISOString()
    const response2 = await (await fetch(`${url}/market/candles/?figi=${figi}&interval=day&from=${from}&to=${to}`, opts)).json()
    if (response2 && response2.payload && response2.payload.candles) {
      const candle = response2.payload.candles[response2.payload.candles.length - 1]
      return candle.c
    }
  }

  return ''
}


import { useState } from 'react'
import './App.css'

const formatPKR = (amount) =>
  new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: 2,
  }).format(amount)

function App() {
  const [salary, setSalary] = useState('')
  const [tax, setTax] = useState('')
  const [eobi, setEobi] = useState('')
  const [pf, setPf] = useState('')
  const [actualNet, setActualNet] = useState('')
  const [deductions, setDeductions] = useState([])
  const [allowances, setAllowances] = useState([])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function addRow(type) {
    const newRow = {
      id: `${Date.now()}-${Math.random()}`,
      name: '',
      amount: '',
    }

    if (type === 'deduction') {
      setDeductions((previous) => [...previous, newRow])
    } else {
      setAllowances((previous) => [...previous, newRow])
    }

    setResult(null)
  }

  function updateRow(type, id, field, value) {
    const setter = type === 'deduction' ? setDeductions : setAllowances

    setter((previous) =>
      previous.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    )

    setResult(null)
  }

  function removeRow(type, id) {
    const setter = type === 'deduction' ? setDeductions : setAllowances
    setter((previous) => previous.filter((row) => row.id !== id))
    setResult(null)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setResult(null)

    const gross = Number(salary)
    const incomeTax = Number(tax || 0)
    const eobiDeduction = Number(eobi || 0)
    const pfDeduction = Number(pf || 0)
    const received = Number(actualNet)

    const extraDeductions = deductions.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0
    )

    const extraAllowances = allowances.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0
    )

    const totalDeductions =
      incomeTax + eobiDeduction + pfDeduction + extraDeductions

    const calculatedNet = gross + extraAllowances - totalDeductions

    if (totalDeductions > gross + extraAllowances) {
      setError(
        'Total deductions salary aur allowances se zyada hain. Please amounts check karein.'
      )
      return
    }

    const difference = received - calculatedNet

    setResult({
      gross,
      incomeTax,
      eobiDeduction,
      pfDeduction,
      extraDeductions,
      extraAllowances,
      totalDeductions,
      calculatedNet,
      received,
      difference,
    })
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#">
          <span className="brand-icon">P</span>
          PakPayCheck
        </a>
        <nav>
          <a href="#how-it-works">How It Works</a>
          <a href="#checker">Salary Checker</a>
          <a href="#about">About</a>
        </nav>
        <a className="nav-button" href="#checker">Check My Payslip</a>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <span className="eyebrow">MADE FOR PAKISTAN 🇵🇰</span>
            <h1>Is Your Salary Slip <span>Actually Correct?</span></h1>
            <p>
              Understand your salary deductions, review your take-home pay,
              and learn what to double-check on your payslip — all in one place.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#checker">
                Check My Salary <span>→</span>
              </a>
              <span className="free-note">Free to use · No account required</span>
            </div>
            <div className="trust-points">
              <span>✓ Clear salary breakdowns</span>
              <span>✓ Built for Pakistan</span>
            </div>
          </div>

          <div className="preview-card">
            <div className="preview-heading">
              <div>
                <span className="muted-label">SALARY OVERVIEW</span>
                <h3>Monthly Breakdown</h3>
              </div>
              <span className="preview-badge">PREVIEW</span>
            </div>
            <div className="salary-total">
              <span>Illustrative gross salary</span>
              <strong>Rs. 150,000</strong>
              <small>Example figures only</small>
            </div>
            <div className="preview-row">
              <span>Income tax</span>
              <strong>Rs. 8,000</strong>
            </div>
            <div className="preview-row">
              <span>EOBI contribution</span>
              <strong>Rs. 370</strong>
            </div>
            <div className="preview-row">
              <span>Provident fund</span>
              <strong>Rs. 6,000</strong>
            </div>
            <div className="preview-net">
              <span>Illustrative take-home pay</span>
              <strong>Rs. 135,630</strong>
            </div>
            <p className="preview-disclaimer">
              Sample numbers only, not an official tax calculation.
            </p>
          </div>
        </section>

        <section className="benefits" id="how-it-works">
          <div>
            <span className="benefit-icon">01</span>
            <h3>Enter Your Details</h3>
            <p>Add your salary and the deductions shown on your payslip.</p>
          </div>
          <div>
            <span className="benefit-icon">02</span>
            <h3>Review the Breakdown</h3>
            <p>Compare the information and identify items that need checking.</p>
          </div>
          <div>
            <span className="benefit-icon">03</span>
            <h3>Understand Differences</h3>
            <p>Get a clearer view of possible discrepancies and next steps.</p>
          </div>
        </section>

        <section className="checker-section" id="checker">
          <div className="section-heading">
            <span className="eyebrow">SALARY CHECKER</span>
            <h2>Start With Your Salary Details</h2>
            <p>
              Enter your payslip amounts, add extra deductions or allowances,
              and compare the calculated amount with your received salary.
            </p>
          </div>

          <form className="salary-form" onSubmit={handleSubmit}>
            <label>
              Monthly gross salary (PKR)
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={salary}
                onChange={(event) => {
                  setSalary(event.target.value)
                  setResult(null)
                }}
                placeholder="e.g. 50000"
              />
            </label>

            <label>
              Income tax shown (PKR)
              <input
                type="number"
                min="0"
                step="0.01"
                value={tax}
                onChange={(event) => {
                  setTax(event.target.value)
                  setResult(null)
                }}
                placeholder="Enter amount"
              />
            </label>

            <label>
              EOBI deduction (PKR)
              <input
                type="number"
                min="0"
                step="0.01"
                value={eobi}
                onChange={(event) => {
                  setEobi(event.target.value)
                  setResult(null)
                }}
                placeholder="Enter amount"
              />
            </label>

            <label>
              Provident fund deduction (PKR)
              <input
                type="number"
                min="0"
                step="0.01"
                value={pf}
                onChange={(event) => {
                  setPf(event.target.value)
                  setResult(null)
                }}
                placeholder="Enter amount"
              />
            </label>

            <div className="extra-section full-width">
              <div className="extra-heading">
                <div>
                  <h3>Additional Deductions</h3>
                  <p>Loan, insurance or other salary deductions.</p>
                </div>
                <button
                  type="button"
                  className="extra-button"
                  onClick={() => addRow('deduction')}
                >
                  + Add Deduction
                </button>
              </div>

              {deductions.map((row) => (
                <div className="extra-row" key={row.id}>
                  <input
                    type="text"
                    aria-label="Deduction name"
                    placeholder="e.g. Loan deduction"
                    value={row.name}
                    onChange={(event) =>
                      updateRow('deduction', row.id, 'name', event.target.value)
                    }
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    aria-label="Deduction amount"
                    placeholder="Amount (PKR)"
                    value={row.amount}
                    onChange={(event) =>
                      updateRow(
                        'deduction',
                        row.id,
                        'amount',
                        event.target.value
                      )
                    }
                  />
                  <button
                    type="button"
                    className="remove-button"
                    aria-label="Remove deduction"
                    onClick={() => removeRow('deduction', row.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="extra-section full-width">
              <div className="extra-heading">
                <div>
                  <h3>Additional Allowances</h3>
                  <p>Bonus, extra payments or other allowances.</p>
                </div>
                <button
                  type="button"
                  className="extra-button"
                  onClick={() => addRow('allowance')}
                >
                  + Add Allowance
                </button>
              </div>

              {allowances.map((row) => (
                <div className="extra-row" key={row.id}>
                  <input
                    type="text"
                    aria-label="Allowance name"
                    placeholder="e.g. Monthly bonus"
                    value={row.name}
                    onChange={(event) =>
                      updateRow('allowance', row.id, 'name', event.target.value)
                    }
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    aria-label="Allowance amount"
                    placeholder="Amount (PKR)"
                    value={row.amount}
                    onChange={(event) =>
                      updateRow(
                        'allowance',
                        row.id,
                        'amount',
                        event.target.value
                      )
                    }
                  />
                  <button
                    type="button"
                    className="remove-button"
                    aria-label="Remove allowance"
                    onClick={() => removeRow('allowance', row.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <label className="full-width">
              Net salary received (PKR)
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={actualNet}
                onChange={(event) => {
                  setActualNet(event.target.value)
                  setResult(null)
                }}
                placeholder="Enter take-home salary"
              />
            </label>

            <button className="primary-button submit-button" type="submit">
              Compare My Salary <span>→</span>
            </button>

            <p className="privacy-note">
              This basic checker uses the amounts you enter. Do not enter
              personal identifiers or upload confidential payslips.
            </p>
          </form>

          {error && (
            <div className="result-card" role="alert">
              <h3>Please check your amounts</h3>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="result-card" aria-live="polite">
              <span className="eyebrow">YOUR SALARY SUMMARY</span>
              <h2>Salary Comparison Results</h2>

              <div className="result-row">
                <span>Gross salary</span>
                <strong>Rs. {formatPKR(result.gross)}</strong>
              </div>
              <div className="result-row">
                <span>Additional allowances</span>
                <strong>+ Rs. {formatPKR(result.extraAllowances)}</strong>
              </div>
              <div className="result-row">
                <span>Income tax</span>
                <strong>Rs. {formatPKR(result.incomeTax)}</strong>
              </div>
              <div className="result-row">
                <span>EOBI deduction</span>
                <strong>Rs. {formatPKR(result.eobiDeduction)}</strong>
              </div>
              <div className="result-row">
                <span>Provident fund</span>
                <strong>Rs. {formatPKR(result.pfDeduction)}</strong>
              </div>
              <div className="result-row">
                <span>Additional deductions</span>
                <strong>Rs. {formatPKR(result.extraDeductions)}</strong>
              </div>
              <div className="result-row">
                <span>Total deductions</span>
                <strong>Rs. {formatPKR(result.totalDeductions)}</strong>
              </div>
              <div className="result-row">
                <span>Calculated net salary</span>
                <strong>Rs. {formatPKR(result.calculatedNet)}</strong>
              </div>
              <div className="result-row">
                <span>Net salary received</span>
                <strong>Rs. {formatPKR(result.received)}</strong>
              </div>

              <div className="result-net">
                <span>Difference</span>
                <strong>
                  {result.difference > 0
                    ? '+ '
                    : result.difference < 0
                      ? '− '
                      : ''}
                  Rs. {formatPKR(Math.abs(result.difference))}
                </strong>
              </div>

              <p>
                {result.difference === 0
                  ? 'The amounts match based on the salary details you entered.'
                  : result.difference < 0
                    ? 'Your received salary is lower than this calculation. Other payroll deductions or adjustments may explain the difference.'
                    : 'Your received salary is higher than this calculation. Other allowances or payroll adjustments may explain the difference.'}
              </p>

              <p className="privacy-note">
                This is an arithmetic comparison, not an official tax or
                payroll verification. Verify results against your employer’s
                payroll details and applicable official rules.
              </p>
            </div>
          )}
        </section>

        <section className="about-section" id="about">
          <h2>Salary clarity starts with understanding your payslip.</h2>
          <p>
            PakPayCheck is being built to help people in Pakistan understand
            salary deductions and spot amounts that may need further review.
            Results should always be checked against applicable official rules
            and your employer's payroll policy.
          </p>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#">
          <span className="brand-icon">P</span>
          PakPayCheck
        </a>
        <p>Clearer salary information for everyone.</p>
        <span>© {new Date().getFullYear()} PakPayCheck</span>
      </footer>
    </div>
  )
}

export default App

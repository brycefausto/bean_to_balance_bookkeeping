export function generateExcelFile(
  balanceSheet: any,
  incomeStatement: any,
  cashFlow: any,
  equityStatement: any,
  timestamp: string,
) {
  // Simple CSV format that Excel can read
  let csvContent = "data:text/csv;charset=utf-8,"

  // Balance Sheet
  csvContent += "BALANCE SHEET\n"
  csvContent += `Date,${balanceSheet.date.toLocaleDateString()}\n\n`
  csvContent += "ASSETS\n"
  Object.entries(balanceSheet.assets).forEach(([name, value]: [string, any]) => {
    csvContent += `${name},$${value.toFixed(2)}\n`
  })
  csvContent += `Total Assets,$${balanceSheet.totalAssets.toFixed(2)}\n\n`

  csvContent += "LIABILITIES\n"
  Object.entries(balanceSheet.liabilities).forEach(([name, value]: [string, any]) => {
    csvContent += `${name},$${value.toFixed(2)}\n`
  })
  csvContent += `Total Liabilities,$${balanceSheet.totalLiabilities.toFixed(2)}\n\n`

  csvContent += "EQUITY\n"
  Object.entries(balanceSheet.equity).forEach(([name, value]: [string, any]) => {
    csvContent += `${name},$${value.toFixed(2)}\n`
  })
  csvContent += `Total Equity,$${balanceSheet.totalEquity.toFixed(2)}\n\n`

  // Income Statement
  csvContent += "INCOME STATEMENT\n"
  csvContent += `Period,${incomeStatement.period}\n\n`
  csvContent += "REVENUE\n"
  Object.entries(incomeStatement.revenue).forEach(([name, value]: [string, any]) => {
    csvContent += `${name},$${value.toFixed(2)}\n`
  })
  csvContent += `Total Revenue,$${incomeStatement.totalRevenue.toFixed(2)}\n\n`

  csvContent += "EXPENSES\n"
  Object.entries(incomeStatement.expenses).forEach(([name, value]: [string, any]) => {
    csvContent += `${name},$${value.toFixed(2)}\n`
  })
  csvContent += `Total Expenses,$${incomeStatement.totalExpenses.toFixed(2)}\n`
  csvContent += `Net Income,$${incomeStatement.netIncome.toFixed(2)}\n\n`

  // Cash Flow Statement
  csvContent += "CASH FLOW STATEMENT\n"
  csvContent += `Period,${cashFlow.period}\n\n`
  csvContent += "OPERATING ACTIVITIES\n"
  Object.entries(cashFlow.operatingActivities).forEach(([name, value]: [string, any]) => {
    csvContent += `${name},$${value.toFixed(2)}\n`
  })
  csvContent += `Total Operating,$${cashFlow.totalOperating.toFixed(2)}\n\n`

  csvContent += "INVESTING ACTIVITIES\n"
  Object.entries(cashFlow.investingActivities).forEach(([name, value]: [string, any]) => {
    csvContent += `${name},$${value.toFixed(2)}\n`
  })
  csvContent += `Total Investing,$${cashFlow.totalInvesting.toFixed(2)}\n\n`

  csvContent += "FINANCING ACTIVITIES\n"
  Object.entries(cashFlow.financingActivities).forEach(([name, value]: [string, any]) => {
    csvContent += `${name},$${value.toFixed(2)}\n`
  })
  csvContent += `Total Financing,$${cashFlow.totalFinancing.toFixed(2)}\n`
  csvContent += `Net Cash Flow,$${cashFlow.netCashFlow.toFixed(2)}\n`
  csvContent += `Beginning Cash,$${cashFlow.beginningCash.toFixed(2)}\n`
  csvContent += `Ending Cash,$${cashFlow.endingCash.toFixed(2)}\n\n`

  // Equity Statement
  csvContent += "STATEMENT OF SHAREHOLDERS' EQUITY\n"
  csvContent += `Period,${equityStatement.period}\n\n`
  csvContent += "Common Stock\n"
  csvContent += `Beginning Balance,$${equityStatement.commonStock.beginning.toFixed(2)}\n`
  csvContent += `Changes,$${equityStatement.commonStock.changes.toFixed(2)}\n`
  csvContent += `Ending Balance,$${equityStatement.commonStock.ending.toFixed(2)}\n\n`

  csvContent += "Retained Earnings\n"
  csvContent += `Beginning Balance,$${equityStatement.retainedEarnings.beginning.toFixed(2)}\n`
  csvContent += `Net Income,$${equityStatement.retainedEarnings.changes.toFixed(2)}\n`
  csvContent += `Ending Balance,$${equityStatement.retainedEarnings.ending.toFixed(2)}\n\n`

  csvContent += `Total Shareholders' Equity,$${equityStatement.totalEquity.toFixed(2)}\n`

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `financial-statements-${timestamp}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

import { formatSpreadSheetPrice } from "./string.utils"

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
    csvContent += `${name},${formatSpreadSheetPrice(value)}\n`
  })
  csvContent += `Total Assets,${formatSpreadSheetPrice(balanceSheet.totalAssets)}\n\n`

  csvContent += "LIABILITIES\n"
  Object.entries(balanceSheet.liabilities).forEach(([name, value]: [string, any]) => {
    csvContent += `${name},${formatSpreadSheetPrice(value)}\n`
  })
  csvContent += `Total Liabilities,${formatSpreadSheetPrice(balanceSheet.totalLiabilities)}\n\n`

  csvContent += "EQUITY\n"
  Object.entries(balanceSheet.equity).forEach(([name, value]: [string, any]) => {
    csvContent += `${name},${formatSpreadSheetPrice(value)}\n`
  })
  csvContent += `Total Equity,${formatSpreadSheetPrice(balanceSheet.totalEquity)}\n\n`

  // Income Statement
  csvContent += "INCOME STATEMENT\n"
  csvContent += `Period,${incomeStatement.period}\n\n`
  csvContent += "REVENUE\n"
  Object.entries(incomeStatement.revenue).forEach(([name, value]: [string, any]) => {
    csvContent += `${name},${formatSpreadSheetPrice(value)}\n`
  })
  csvContent += `Total Revenue,${formatSpreadSheetPrice(incomeStatement.totalRevenue)}\n\n`

  csvContent += "EXPENSES\n"
  Object.entries(incomeStatement.expenses).forEach(([name, value]: [string, any]) => {
    csvContent += `${name},${formatSpreadSheetPrice(value)}\n`
  })
  csvContent += `Total Expenses,${formatSpreadSheetPrice(incomeStatement.totalExpenses)}\n`
  csvContent += `Net Income,${formatSpreadSheetPrice(incomeStatement.netIncome)}\n\n`

  // Cash Flow Statement
  csvContent += "CASH FLOW STATEMENT\n"
  csvContent += `Period,${cashFlow.period}\n\n`
  csvContent += "OPERATING ACTIVITIES\n"
  Object.entries(cashFlow.operatingActivities).forEach(([name, value]: [string, any]) => {
    csvContent += `${name},${formatSpreadSheetPrice(value)}\n`
  })
  csvContent += `Total Operating,${formatSpreadSheetPrice(cashFlow.totalOperating)}\n\n`

  csvContent += "INVESTING ACTIVITIES\n"
  Object.entries(cashFlow.investingActivities).forEach(([name, value]: [string, any]) => {
    csvContent += `${name},${formatSpreadSheetPrice(value)}\n`
  })
  csvContent += `Total Investing,${formatSpreadSheetPrice(cashFlow.totalInvesting)}\n\n`

  csvContent += "FINANCING ACTIVITIES\n"
  Object.entries(cashFlow.financingActivities).forEach(([name, value]: [string, any]) => {
    csvContent += `${name},${formatSpreadSheetPrice(value)}\n`
  })
  csvContent += `Total Financing,${formatSpreadSheetPrice(cashFlow.totalFinancing)}\n`
  csvContent += `Net Cash Flow,${formatSpreadSheetPrice(cashFlow.netCashFlow)}\n`
  csvContent += `Beginning Cash,${formatSpreadSheetPrice(cashFlow.beginningCash)}\n`
  csvContent += `Ending Cash,${formatSpreadSheetPrice(cashFlow.endingCash)}\n\n`

  // Equity Statement
  csvContent += "STATEMENT OF SHAREHOLDERS' EQUITY\n"
  csvContent += `Period,${equityStatement.period}\n\n`
  csvContent += "Common Stock\n"
  csvContent += `Beginning Balance,${formatSpreadSheetPrice(equityStatement.commonStock.beginning)}\n`
  csvContent += `Changes,${formatSpreadSheetPrice(equityStatement.commonStock.changes)}\n`
  csvContent += `Ending Balance,${formatSpreadSheetPrice(equityStatement.commonStock.ending)}\n\n`

  csvContent += "Retained Earnings\n"
  csvContent += `Beginning Balance,${formatSpreadSheetPrice(equityStatement.retainedEarnings.beginning)}\n`
  csvContent += `Net Income,${formatSpreadSheetPrice(equityStatement.retainedEarnings.changes)}\n`
  csvContent += `Ending Balance,${formatSpreadSheetPrice(equityStatement.retainedEarnings.ending)}\n\n`

  csvContent += `Total Shareholders' Equity,${formatSpreadSheetPrice(equityStatement.totalEquity)}\n`

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `financial-statements-${timestamp}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportReportsToCSV(
  trialBalance: any[],
  accountsByType: Record<string, number>,
  totalDebits: number,
  totalCredits: number,
  timestamp: string,
) {
  let csvContent = "data:text/csv;charset=utf-8,"

  csvContent += "FINANCIAL REPORTS\n"
  csvContent += `Export Date,${new Date().toLocaleDateString()}\n\n`

  // Trial Balance
  csvContent += "TRIAL BALANCE\n"
  csvContent += "Account Code,Account Name,Debit,Credit\n"
  trialBalance.forEach((account) => {
    csvContent += `${account.code},${account.name},${account.debit > 0 ? formatSpreadSheetPrice(account.debit) : ""},${account.credit > 0 ? formatSpreadSheetPrice(account.credit) : ""}\n`
  })
  csvContent += `TOTALS,,${formatSpreadSheetPrice(totalDebits)},${formatSpreadSheetPrice(totalCredits)}\n\n`

  // Account Distribution by Type
  csvContent += "ACCOUNT DISTRIBUTION BY TYPE\n"
  csvContent += "Account Type,Balance\n"
  Object.entries(accountsByType).forEach(([type, balance]) => {
    csvContent += `${type},${formatSpreadSheetPrice(balance as number)}\n`
  })

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `financial-reports-${timestamp}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

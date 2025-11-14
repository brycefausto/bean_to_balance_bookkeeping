import * as ExcelJS from "exceljs";
import "server-only";

// --- Type Definitions ---

/**
 * Defines the structure of a single account object read from chart_of_accounts.json.
 */
interface Account {
  code: string;
  name: string;
  description: string | null;
  accountType: string;
  financialReport: string | null;
  normalSide: string;
}

// Defines the strict structure for the field mapping object.
// Key: A property name from the Account interface.
// Value: The corresponding string to be used as the Excel column header.
type FieldMapping = {
  [K in keyof Account]: string;
};

// --- Configuration ---
const TEMPLATE_FILE: string = "./files/Chart_of_Accounts.xlsx";
const OUTPUT_FILE: string = "./files/New_Chart_of_Accounts.xlsx";

// The field mapping object, now strictly typed.
const fieldMapping: FieldMapping = {
  code: "ACCOUNT NO.",
  name: "ACCOUNT NAME",
  description: "ACCOUNT DESCRIPTION",
  accountType: "ACCOUNT TYPE",
  financialReport: "FINANCIAL REPORT",
  normalSide: "TO INCREASE ACCOUNT",
};

/**
 * Reads the JSON data, maps it to the desired Excel format,
 * creates the Excel file, and applies autofit column width.
 */
export async function generateChartOfAccounts(data: Account[]) {
  // 2. Process Data and Prepare Headers
  const jsonKeys = Object.keys(fieldMapping) as (keyof Account)[];
  const excelHeaders = Object.values(fieldMapping);

  // Map the array of Account objects into an array of arrays (rows)
  const mappedData: string[][] = data.map((item: Account) => {
    // Return the row as an array of values in the correct column order
    return jsonKeys.map((key) => {
      // Access the property using the key and ensure it's a non-null string
      const value = item[key];
      return value !== undefined && value !== null ? String(value).trim() : "";
    });
  });

  // 3. Create Excel Workbook and Worksheet
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(TEMPLATE_FILE);
  const worksheet = workbook.getWorksheet("Chart of Accounts");

  if (!worksheet) {
    throw new Error("Worksheet not found");
  }
  
  // 5. Add Data Rows
  const startingRow = 2;
  mappedData.forEach((row: string[], i) => {
    worksheet.insertRow(i + startingRow, row);
  });

  // 6. Autofit Column Width
  // Calculate max width for each column based on header and data
  worksheet.columns = excelHeaders.map((header: string, index: number) => {
    // Start with the header length
    let maxLength: number = header.length;

    // Find the maximum length in the column data
    mappedData.forEach((row: string[]) => {
      const cellValue = row[index];
      if (cellValue && cellValue.length > maxLength) {
        maxLength = cellValue.length;
      }
    });

    // Set the column definition with the calculated width (+ 2 for padding)
    return {
      header: header,
      key: jsonKeys[index],
      // Ensure minimum width is 10, otherwise use the calculated length + 2
      width: maxLength < 10 ? 10 : maxLength + 2,
    };
  });

  // 7. Save the Excel File
  try {
    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error writing Excel file: ${error.message}`);
    } else {
      console.error("An unknown error occurred during file writing.");
    }
  }
}

import { generateChartOfAccounts } from "@/lib/excel.utils";
import { bookAccountService } from "@/services/book-account.service";
import { NextRequest } from "next/server";

const FILE_NAME = "Chart_of_Accounts.xlsx";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/export/chart-of-accounts/[companyId]">
) {
  const { companyId } = await ctx.params;
  const bookAccounts = await bookAccountService.findAll(companyId);

  // Generate buffer
  const buffer = await generateChartOfAccounts(bookAccounts);

  // Set response headers for download
  const headers = new Headers();

  // Set the content type to indicate an Excel file
  headers.append(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  // Set the Content-Disposition header to prompt a download
  headers.append("Content-Disposition", `attachment; filename="${FILE_NAME}"`);

  // 5. Return the Response
  // We use the standard Response object from the Web API, which Next.js supports.
  // Convert Node.js Buffer to Uint8Array for the Response constructor
  return new Response(buffer, {
    status: 200,
    headers: headers,
  });
}

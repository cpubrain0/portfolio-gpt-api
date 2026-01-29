import { google } from "googleapis";

export default async function handler(req, res) {

  try {

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const sheetId = process.env.SHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Data!B10:AO",
    });

    const rows = response.data.values || [];

    let totalProfit = 0;
    let totalValue = 0;

    rows.forEach(row => {

      const mktValue = parseFloat((row[10] || "").replace(/,/g, ""));
      const profit = parseFloat((row[13] || "").replace(/,/g, ""));

      if (!isNaN(mktValue)) totalValue += mktValue;
      if (!isNaN(profit)) totalProfit += profit;

    });

    res.status(200).json({
      currency: "SAR",
      total_profit: Number(totalProfit.toFixed(2)),
      total_value: Number(totalValue.toFixed(2))
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
}

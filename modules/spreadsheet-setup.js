require('dotenv').config();
const { GoogleSpreadsheet } = require('google-spreadsheet');
let doc;

// Connect to spreadsheet
async function connect() {
    try {
        doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
        });
        console.log("connected to spreadsheet!")
    }
    catch (err) {
        console.log(err)
    }
}

// Appropriately formats the raw rows from the spreadsheet
async function fetchJSON() {
    const rows = await fetchRaw()
    let result = {}
    rows.forEach(element => {
        result[element.Key] = element.Value
    });
    return result
}

// Fetches all raw rows from the spreadsheet
async function fetchRaw() {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    return rows
}

// Deletes a row from the spreadsheet
async function remove(index) {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    await rows[index].delete();
}

// Add a new row to the spreadsheet
async function add(key, val) {
    let pair = { "Key": key, "Value": val }
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow(pair);
}

// Edit existing row in the spreadsheet
async function edit(index, key, val) {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    rows[index].Key = key
    rows[index].Value = val
    await rows[index].save();
}

module.exports = {
    connect: connect,
    fetchRaw: fetchRaw,
    fetchJSON: fetchJSON,
    remove: remove,
    add: add,
    edit: edit,
};
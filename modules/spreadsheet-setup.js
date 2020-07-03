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

// Fetches all rows from the spreadsheet
async function fetch() {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const result = rows.map(element => {
        let obj = {}
        obj[element.Task] = element.Done
        return obj
    });
    return result
}

// Deletes a row from the spreadsheet
async function remove(id) {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    await rows[id].delete();
}

// Add a new row to the spreadsheet
async function add(todoName, isDone) {
    let todo = { "Task": todoName, "Done": isDone }
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow(todo);
}

// Edit existing row in the spreadsheet
async function edit(id, todoName, isDone) {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    rows[id].Task = todoName
    rows[id].Done = isDone
    await rows[id].save();
}

module.exports = {
    connect: connect,
    fetch: fetch,
    remove: remove,
    add: add,
    edit: edit,
};
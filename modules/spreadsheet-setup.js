require('dotenv').config();
const { GoogleSpreadsheet } = require('google-spreadsheet');
let doc;

// connect to spreadsheet
async function connect() {
    doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth(require('../client-secret.json'));
    console.log("connected to spreadsheet!")
}

// fetches all rows
async function fetch() {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; 
    const rows = await sheet.getRows();
    const result = rows.map(element =>  {
        let obj = {}
        obj[element.Task] = element.Done
        return obj
    });
    return result
}

// deletes a row
async function remove(id) {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; 
    const rows = await sheet.getRows();
    let info = await rows[id].delete();
    console.log(info);
}

// add a new row
async function add(todoName, isDone) {
    let todo = {"Task" : todoName, "Done" : isDone}
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; 
    let info = await sheet.addRow(todo);
    console.log(info);
}

// edit existing row
async function edit(id, todoName, isDone) {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; 
    const rows = await sheet.getRows();
    rows[id].Task =  todoName
    rows[id].Done =  isDone
    await rows[id].save(); 
}

module.exports = {
    connect: connect,
    fetch: fetch,
    remove: remove,
    add: add,
    edit: edit,
};
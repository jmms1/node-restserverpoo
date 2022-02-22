const ExcelJS = require('exceljs');





const pruebaArchivo = async () => {

    const workbook = new Excel.Workbook();
    
    let worksheet = workbook.addWorksheet('Debtors')
    
    
    worksheet.columns = [
        {header: 'First Name', key: 'firstName'},
        {header: 'Last Name', key: 'lastName'},
        {header: 'Purchase Price', key: 'purchasePrice'},
        {header: 'Payments Made', key: 'paymentsMade'},
        {header: 'Amount Remaining', key: 'amountRemaining'},
        {header: '% Remaining', key: 'percentRemaining'}
      ]
    
    
      await workbook.xlsx.writeFile('../uploads/general/Debtors.xlsx')



}

module.exports = {
    pruebaArchivo
}
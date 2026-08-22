/**
 * Codi per al full de càlcul "Entrenaments".
 *
 * CONFIGURACIÓ PRÈVIA AL SHEET (fer-ho abans de desplegar):
 * 1) Pestanya "Registres" — Fila 1 (capçalera): Data | Concepte | Minuts
 * 2) Pestanya "Conceptes" — un concepte per fila a la columna A (sense capçalera)
 * 3) Pestanya "Feedback" — Fila 1 (capçalera): Data | Jugadora | Cansament
 *    (la fa servir l'app de jugadores per desar el feedback post-entrenament)
 *
 * DESPLEGAMENT:
 * Desplegament -> Gestiona desplegaments -> llapis (editar) -> Nova versió -> Desplega
 * (si ja tens l'aplicació web desplegada, no cal tornar a canviar la URL /exec)
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var regSheet = ss.getSheetByName('Registres');
  var concSheet = ss.getSheetByName('Conceptes');

  var registres = [];
  if (regSheet) {
    var regData = regSheet.getDataRange().getValues();
    for (var i = 1; i < regData.length; i++) { // salta capçalera
      var row = regData[i];
      if (!row[0]) continue;
      var dataVal = row[0];
      var dataStr;
      if (dataVal instanceof Date) {
        dataStr = Utilities.formatDate(dataVal, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      } else {
        var asDate = new Date(dataVal);
        dataStr = isNaN(asDate) ? String(dataVal) : Utilities.formatDate(asDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      }
      registres.push({ data: dataStr, concepte: row[1], minuts: row[2] });
    }
  }

  var conceptes = [];
  if (concSheet) {
    var concData = concSheet.getDataRange().getValues();
    for (var j = 0; j < concData.length; j++) {
      var v = concData[j][0];
      if (v) conceptes.push(String(v));
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ registres: registres, conceptes: conceptes }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var body = JSON.parse(e.postData.contents);

  if (body.type === 'feedback') {
    var fbSheet = ss.getSheetByName('Feedback');
    fbSheet.appendRow([body.data, body.jugadora, body.cansament]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var sheet = ss.getSheetByName('Registres');
  var entries = body.entries || [];
  entries.forEach(function (entry) {
    sheet.appendRow([entry.data, entry.concepte, entry.minuts]);
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

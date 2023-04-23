import htmlToPdf from 'html-pdf';
import fs from 'fs';

export async function export_pdf(){
  const options = { format: 'A4' };
  const pdfPath = 'example.pdf';
  const pdfStream = fs.createWriteStream(pdfPath);
  const html = document.querySelector('#exportPdf').innerHTML;
  setTimeout(() => {
  htmlToPdf.create(html, options).toStream((err, stream) => {
    if (err) return console.log(err);
    stream.pipe(pdfStream);
  });}, 1000);
}
export async function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}
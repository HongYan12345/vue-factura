import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

export async function export_pdf(html){
  const exportPdfElement = document.querySelector('#exportPdf');

  // 备份原始 style
  const originalStyle = exportPdfElement.getAttribute('style') || '';

  // 将 style 设置为 "all: initial"
  exportPdfElement.setAttribute('style', 'all: initial');

  // 等待 CSS 加载
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 还原原始 style
  exportPdfElement.setAttribute('style', originalStyle);
    let top = html
      if (top != null) {
        top.scrollIntoView();
        top = null;
      }
      let title = "this.exportPDFtitle";
      setTimeout(() => {
      html2Canvas(document.querySelector('#exportPdf'), {
        allowTaint: true,useCORS: true 
      }).then(function (canvas) {
        // 获取canvas画布的宽高
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        // 一页pdf显示html页面生成的canvas高度
        let pageHeight = 841.89;
        // 未生成pdf的html页面宽度
        let leftHeight = contentHeight;
        // 页面偏移
        let position = 0;
        // html页面生成的canvas在pdf中图片的宽高
        let imgWidth = 595.28;
        let imgHeight = 595.28 / contentWidth * contentHeight;
        let pageData = canvas.toDataURL('image/jpeg', 1.0);
        let PDF = new JsPDF('p', 'pt', 'a4');
        // 两个宽度需要区分: 一个是html页面的实际宽度，和生成pdf的页面宽度
        // 当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', position, 0, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            // 避免添加空白页
            if (leftHeight > 0) {
              PDF.addPage();
            }
          }
        }
        PDF.save(title + '.pdf');
      })}, 1000);
      
}

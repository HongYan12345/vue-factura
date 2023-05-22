import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
import { nextTick } from 'vue';

export async function export_pdf(html,num){
    let top = html
      if (top != null) {
        top.scrollIntoView();
        top = null;
      }
      let title = "N." + num;
      const container = html
      
      html2Canvas(container, {
        scale:2,
        useCORS: true 
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
        let imgHeight = imgWidth / contentWidth * contentHeight;
        let pageData = canvas.toDataURL('image/jpeg', 1.0);
        let PDF = new JsPDF('p', 'pt', 'a4');
        // 两个宽度需要区分: 一个是html页面的实际宽度，和生成pdf的页面宽度
        // 当内容未超过pdf一页显示的范围，无需分页
        PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        // if (leftHeight < pageHeight) {
        //   PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        // } else {
        //   while (leftHeight > 0) {
        //     PDF.addImage(pageData, 'JPEG', position, 0, imgWidth, imgHeight);
        //     leftHeight -= pageHeight;
        //     position -= 841.89;
        //     // 避免添加空白页
        //     if (leftHeight > 0) {
        //       PDF.addPage();
        //     }
        //   }
        // }
        PDF.save(title + '.pdf');
        
      })
      
}


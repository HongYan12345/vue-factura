// 导出页面为PDF格式
import html2Canvas from 'html2canvas' // 引入html2canvas
import JsPDF from 'jspdf' // 引入jspdf
export default {
  install(Vue: { prototype: { getPdf: (title: any, idPdf: any, type: string) => void } }, options: any) {
    Vue.prototype.getPdf = (title: any, idPdf: any, type: string) => {
      const dataId: any = document.querySelector('#' + idPdf); // 或者用ref
      html2Canvas(dataId, {
        allowTaint: true
      }).then((canvas) => {
        let PDF: any = new JsPDF('p', 'pt', 'a4')
        const contentWidth: any = canvas.width
        const contentHeight: any = canvas.height
        const pageHeight: any = contentWidth / 592.28 * 841.89
        let leftHeight: any = contentHeight
        let position: any = 0
        const imgWidth: any = 595.28
        const imgHeight: any = 592.28 / contentWidth * contentHeight
        // 加水印
        let ctx: any = canvas.getContext("2d");
        ctx.font = "60px Georgia";
        ctx.fillStyle = "rgba(214,214,214,0.4)";
        ctx.textAlign = "start"
        ctx.textBaseline = "hanging";
        const num = contentHeight / 600
        // 每隔一段距离出现一次水印
        for (let i = 0; i <= num; i++) {
          if(type == 'table') {
            // 表格类型水印
            if(imgHeight < 600) { // 这里根据图片高度要进行下判断
              ctx.fillText("这是水印信息", (canvas.width - 400) / 2 + (canvas.width / 4), (i * 300) + 120);
            }else {
              ctx.fillText("这是水印信息", (canvas.width - 400) / 2 + (canvas.width / 4), (i * 600) + 500);
            }
          }else {
          	// 其他类型
            if(imgHeight < 600) { // 这里根据图片高度要进行下判断
              ctx.fillText("这是水印信息", canvas.width/2 + 120, (i * 300) + 120);
            }else {
              ctx.fillText("这是水印信息", canvas.width/2 + 120, (i * 600) + 500);
            }
          }          
        }
        // 加水印
        
        const pageData: any = canvas.toDataURL('image/jpeg', 1.0)

        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf') // 生成pdf
      }
      )
    }
  }
}


// html直接生成pdf截图
export async function export_pdf(){
    let imgload = this.judgeimg()
    if (!imgload) {
        return false
    }
    const pdf = new window.jsPDF('', 'pt', 'a4')
    let orderList = document.getElementsByClassName('exportPdf')
    for (let i = 0, len = orderList.length; i < len; i++) {
        let target = orderList[i]
        target.style.background = '#FFFFFF'
        target.style.width = '55%'
        pdf.addHTML(target, function () {
            if (i < len - 1) {
                pdf.addPage()
            }
            if (i === len - 1) {
                pdf.save('01.pdf')
            }
        })
    }
}

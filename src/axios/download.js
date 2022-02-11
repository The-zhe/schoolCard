import { getBlob } from "@/axios";
import { baseUrl } from "@/configs";
import fileDownload from "js-file-download";
export function testPaperDownload (id, name) {
    getBlob(`${baseUrl}/oto/testPaper/download/${id}`, {}, { type: 'download' }).then(res => {
        return fileDownload(res.data, `${name}.docx` || '');
    })
}

export function excelDownload (data) {
    getBlob(`${baseUrl}/oto/testPaperTemplate/exportTranscript`, data, { type: 'download' }).then(res => {
        console.log('excelDownload', res.data)
        return fileDownload(res.data, `${data.name}.xlsx` || '');
    })
}

export function exportScore (data) {
    getBlob(`${baseUrl}/oto/testPaperTemplate/exportScore`, data, { type: 'download' }).then(res => {
        const name = res.headers['content-disposition'].split("=")[1]
        return fileDownload(res.data, name || '');
    })
}

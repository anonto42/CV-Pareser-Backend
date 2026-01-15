import z from "zod"


const pdfUploadValidator = z.object({
    body: z.object({}).strict(),
    params: z.object({}).strict(),
    query: z.object({}).strict(),
})

export const CVIngestionValidator = {
    pdfUpload: pdfUploadValidator
}

import z from "zod"

const pdfUploadValidator = z.object({
    body: z.object({}).strict(),
    file: z.object({
        fieldname: z.string({ required_error: "Cv file is required" }),
    }).optional(),
    params: z.object({}).strict(),
    query: z.object({}).strict(),
})

export const CVIngestionValidator = {
    pdfUpload: pdfUploadValidator
}

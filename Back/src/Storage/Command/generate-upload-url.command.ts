
export class GenerateUploadUrlCommand {
    constructor(readonly payload: { bucket: string, key: string, mimeType: string, size: number }) {
    }
}
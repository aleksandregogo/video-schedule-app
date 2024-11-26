
export class DeleteFileCommand {
    constructor(readonly payload: { bucket: string, key: string }) {
    }
}
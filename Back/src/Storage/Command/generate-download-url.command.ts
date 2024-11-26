
export class GenerateDownloadUrlCommand {
    constructor(readonly payload: {bucket: string, key: string}) {
    }
}
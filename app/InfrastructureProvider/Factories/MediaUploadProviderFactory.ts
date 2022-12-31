import FileSystemMediaUploadDriver from 'App/InfrastructureProvider/External/MediaUpload/FileSystemMediaUploadDriver'
import { SERVICE_PROVIDER_DOES_NOT_EXIST } from 'App/Helpers/GeneralPurpose/customSystemMessages';
export default class MediaUploadProviderFactory {
    protected CurrentProvider: string

    constructor(currenctProvider: string) {
        this.CurrentProvider = currenctProvider
    }

    public build(): FileSystemMediaUploadDriver | string {
        if (this.CurrentProvider === 'disk') {
            const activatedProvider: FileSystemMediaUploadDriver = new FileSystemMediaUploadDriver()
            return activatedProvider
        }
        return SERVICE_PROVIDER_DOES_NOT_EXIST
    }
}

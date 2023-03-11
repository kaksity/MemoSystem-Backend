import MediaUploadInterface from 'App/TypeChecking/MediaUpload/MediaUploadInterface'
import UploadPayloadInterface from 'App/TypeChecking/MediaUpload/UploadPayloadInterface'
import mediaUploadConfig from 'Config/mediaUpload'
import Env from '@ioc:Adonis/Core/Env'
import FileUploadClient from 'App/InfrastructureProvider/Internal/FileUploadClient'

export default class FileSystemMediaUploadDriver implements MediaUploadInterface {
  /**
   * Private attribute for Service Provider Identifier
   */
  #serviceIdentifier: string = mediaUploadConfig.disk.identifier

  private _processFileUploadToDisk: Function = async (
    uploadPayloadOptions: UploadPayloadInterface
  ): Promise<string> => {
    return await FileUploadClient.uploadToDisk(uploadPayloadOptions)
  }
  private _processFileUploadToCloudOrDisk: Function = async (uploadPayloadOptions) => {
    const uploadDestination = Env.get('DEFAULT_UPLOAD_DESTINATION')

    if (uploadDestination === 'disk') {
      return this._processFileUploadToDisk(uploadPayloadOptions)
    } else {
      return this._processFileUploadToCloud
    }
  }
  private _processFileUploadToCloud: Function = (): string => {
    return 'Error'
  }
  uploadToDisk: Function = this._processFileUploadToDisk
  uploadToCloud: Function = this._processFileUploadToCloud
  upload: Function = this._processFileUploadToCloudOrDisk
  currentProvider: Function
}

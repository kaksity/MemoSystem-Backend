import { NULL_OBJECT } from 'App/Helpers/GeneralPurpose/CustomMessages/SystemCustomMessages'
import UploadPayloadInterface from 'App/TypeChecking/MediaUpload/UploadPayloadInterface'
import processFileNameChange from 'App/Helpers/GeneralPurpose/processFileNameChange'
import Env from '@ioc:Adonis/Core/Env'
import { FILE_UPLOAD_DOES_NOT_EXIST } from 'App/Helpers/GeneralPurpose/CustomMessages/FileUploadCustomMessages'
class FileUploadClient {
  public static async uploadToDisk(uploadPayloadOptions: UploadPayloadInterface): Promise<string> {
    try {
      const { uploadedFile, storageFolder = '' } = uploadPayloadOptions

      if (uploadedFile === NULL_OBJECT) {
        return FILE_UPLOAD_DOES_NOT_EXIST
      }
      const newFileName = processFileNameChange(uploadedFile)

      await uploadedFile.move(`${Env.get('DISK_FILE_UPLOAD_PATH')}/${storageFolder}`, {
        name: newFileName,
        overwrite: true,
      })

      return `${storageFolder}/${newFileName}`
    } catch (error) {
      console.log(error)
      return 'error'
    }
  }
}

export default FileUploadClient

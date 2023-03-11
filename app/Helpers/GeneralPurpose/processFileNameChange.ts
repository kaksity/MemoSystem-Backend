import removeFileExtension from 'App/Helpers/GeneralPurpose/removeFileExtension'
import { string } from '@ioc:Adonis/Core/Helpers'

function processFileNameChange(uploadedFileItem: any): string {
  const timestamp = new Date().valueOf()
  const customFileName = removeFileExtension(uploadedFileItem.clientName)
  return `${timestamp}_${string.snakeCase(customFileName)}.${uploadedFileItem.extname}`
}

export default processFileNameChange

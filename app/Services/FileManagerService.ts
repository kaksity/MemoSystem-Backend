import { SERVICE_PROVIDER_DOES_NOT_EXIST } from 'App/Helpers/GeneralPurpose/CustomMessages/SystemCustomMessages'
import fetchInfrastructureProvider from 'App/Providers/fetchInfrastructureProvider'
import InfrastructureProviderGeneratorOptionsType from 'App/TypeChecking/GeneralPurpose/InfrastructureProviderGeneratorOptionsType'
import mediaUploadConfig from 'Config/mediaUpload'
import MediaUploadInterface from '../TypeChecking/MediaUpload/MediaUploadInterface'
import fetchCurrentMediaUploadProvider from 'App/Helpers/Providers/fetchCurrentMediaUploadProvider'

export default class FileManagerService {
  public async saveFile(file: any, storageFolder: string) {
    const providerGeneratorOptions: InfrastructureProviderGeneratorOptionsType = {
      identifiedProvider: mediaUploadConfig.currentProvider,
      fetchCurrentProvider: fetchCurrentMediaUploadProvider,
    }

    const { checkProviderOutcome, infrastructureProvider } =
      fetchInfrastructureProvider(providerGeneratorOptions)

    if (checkProviderOutcome === SERVICE_PROVIDER_DOES_NOT_EXIST) {
      return 'Error'
    }

    const MediaUploadProvider: MediaUploadInterface = infrastructureProvider

    const uploadedFile = file

    const mediaUploadPayloadOptions = {
      uploadedFile,
      storageFolder,
    }

    const filePath = await MediaUploadProvider.upload(mediaUploadPayloadOptions)

    return filePath
  }
  public async getFile(path) {}
}

import { SERVICE_PROVIDER_DOES_NOT_EXIST } from 'App/Helpers/GeneralPurpose/CustomMessages/customSystemMessages'

export default function isServiceProviderValid(serviceProvider: any): boolean | string {
  const SERVICE_PROVIDER_IS_VALID = true

  if (serviceProvider === SERVICE_PROVIDER_DOES_NOT_EXIST) {
    return SERVICE_PROVIDER_DOES_NOT_EXIST
  }

  return SERVICE_PROVIDER_IS_VALID
}

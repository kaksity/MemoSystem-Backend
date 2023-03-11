import isServiceProviderValid from 'App/Helpers/Providers/isServiceProviderValid'
import InfrastructureProviderGeneratorOptionsType from 'App/TypeChecking/GeneralPurpose/InfrastructureProviderGeneratorOptionsType'

export default function fetchInfrastructureProvider(
  infrastructureProviderOptions: InfrastructureProviderGeneratorOptionsType
): Record<string, string | boolean | any> {
  const { identifiedProvider, fetchCurrentProvider } = infrastructureProviderOptions

  const infrastructureProvider = fetchCurrentProvider(identifiedProvider)

  const checkProviderOutcome = isServiceProviderValid(infrastructureProvider)

  return { checkProviderOutcome, infrastructureProvider }
}

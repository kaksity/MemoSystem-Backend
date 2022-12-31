import MediaUploadProviderFactory from 'App/InfrastructureProvider/Factories/MediaUploadProviderFactory';
import Env from '@ioc:Adonis/Core/Env';
export default function fetchCurrentMediaUploadProvider() {
    const mediaUploadProviderFactory = new MediaUploadProviderFactory(Env.get('CURRENT_MEDIA_UPLOAD_PROVIDER'))
    return mediaUploadProviderFactory.build()
}

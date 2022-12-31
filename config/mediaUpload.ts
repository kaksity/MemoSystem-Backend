import Env from '@ioc:Adonis/Core/Env';
const mediaUploadConfig = {

    /**
    *Current Infrastructure Provider in use
    */
    currentProvider: Env.get('CURRENT_MEDIA_UPLOAD_PROVIDER'),

    disk: {
        identifier: 'disk'
    }
}

export default mediaUploadConfig

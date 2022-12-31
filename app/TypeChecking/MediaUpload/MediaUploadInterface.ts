export default interface MediaUploadInterface {
    /**
     * Public method to upload media file to the filesystem
     */
    uploadToDisk: Function
    
    /**
     * Public method to upload media file to the cloud
     */
    uploadToCloud: Function

    /**
     * Public method to upload media file to either the file system or a cloud provider
     */
    upload: Function

    /**
     * Public method to show the current provider
     */
    currentProvider: Function
}

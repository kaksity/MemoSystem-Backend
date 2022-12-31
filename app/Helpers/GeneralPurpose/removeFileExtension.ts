function removeFileExtension(fileName: string): string {
    return fileName.substring(0, fileName.lastIndexOf('.')) || fileName
}

export default removeFileExtension

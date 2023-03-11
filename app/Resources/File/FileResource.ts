import File from 'App/Models/File'

interface FileInterface {
  id: string
  name: string
  code: string
  description: string
  createdOn: Date | string
}

export default class FileResource {
  public static single(file: File): FileInterface {
    return {
      id: file.id,
      name: file.name,
      code: file.code,
      description: file.description,
      createdOn: file.createdAt,
    }
  }
  public static collection(files: File[]): FileInterface[] {
    return files.map((file) => {
      return this.single(file)
    })
  }
}

import { NULL_OBJECT } from 'App/Helpers/GeneralPurpose/CustomMessages/SystemCustomMessages'
import File from 'App/Models/File'
import DeleteRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/DeleteRecordPayloadOptions'
import UpdateRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/UpdateRecordPayloadOptions'
import FileObjectInterface from 'App/TypeChecking/ModelManagement/FileObjectInterface'

export default class FileService {
  /**
   * @description
   * @author Dauda Pona
   * @param {*} { name, code, description }
   * @param {User} user
   * @returns {*}  {Promise<void>}
   * @memberof FileService
   */
  public async createFileRecord(
    createFileObjectInterface: Partial<FileObjectInterface>
  ): Promise<File> {
    const { transaction } = createFileObjectInterface

    const file = new File()

    Object.assign(file, createFileObjectInterface)

    if (transaction) {
      file.useTransaction(transaction)
    }
    file.save()

    return file
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {string} id
   * @returns {*}  {(Promise<File | null>)}
   * @memberof FileService
   */
  public async getFileById(id: string): Promise<File | null> {
    const file = await File.query()
      .preload('user', (userQuery) => {
        userQuery.preload('role')
      })
      .where('id', id)
      .first()

    if (file === NULL_OBJECT) {
      return NULL_OBJECT
    }
    return file
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {File} file
   * @returns {*}  {Promise<void>}
   * @memberof FileService
   */
  public async deleteFileRecord(
    deleteFilePayloadOptions: DeleteRecordPayloadOptions
  ): Promise<void> {
    const { entityId, transaction } = deleteFilePayloadOptions

    const file = await this.getFileById(entityId)

    if (transaction) {
      file!.useTransaction(transaction)
    }

    await file!.delete()
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {UpdateRecordPayloadOptions} updateFileRecordPayloadOptions
   * @returns {*}  {Promise<void>}
   * @memberof FileService
   */
  public async updateFileRecord(
    updateFileRecordPayloadOptions: UpdateRecordPayloadOptions
  ): Promise<void> {
    const { entityId, transaction, modifiedData } = updateFileRecordPayloadOptions

    const file = await this.getFileById(entityId)

    file!.merge(modifiedData)
    if (transaction) {
      file!.useTransaction(transaction)
    }

    await file!.save()
  }
  /**
   * @description
   * @author Dauda Pona
   * @param {string} code
   * @returns {*}  {(Promise<File | null>)}
   * @memberof FileService
   */
  public async getFileByCode(code: string): Promise<File | null> {
    const file = await File.query()
      .preload('user', (userQuery) => {
        userQuery.preload('role')
      })
      .where('code', code)
      .first()

    if (file === NULL_OBJECT) {
      return NULL_OBJECT
    }

    return file
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {*} { page, limit }
   * @returns {*}  {Promise<{ data: File[]; meta?: any }>}
   * @memberof FileService
   */
  public async getAllFiles({ page, limit }): Promise<{ data: File[]; meta?: any }> {
    const files = await File.query()
      .preload('user', (userQuery) => {
        userQuery.preload('role')
      })
      .paginate(page, limit)
    return { data: files.all(), meta: files.getMeta() }
  }
}

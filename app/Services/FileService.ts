import File from 'App/Models/File'
import User from 'App/Models/User'
export default class FileService {
    public async createFile({ name, code, description }, user: User): Promise<void> {
        await File.create({ name, code, description, userId: user.id })
    }

    public async getFileById(id: string): Promise<File | null> {
        return await File.query().preload('user', userQuery => {
            userQuery.preload('role')
        }).where('id', id).first()
    }

    public async deleteFile(file: File): Promise<void> {
        await file.delete()
    }
    public async getFileByCode(code: string): Promise<File | null> {
        return await File.query().preload('user', userQuery => {
            userQuery.preload('role')
        }).where('code', code).first()
    }
    public async getAllFiles({ page, limit }): Promise<{ data: File[], meta?: any }>{
        const files = await File.query().preload('user', userQuery => {
            userQuery.preload('role')
        }).paginate(page, limit)
        return { data: files.all(), meta: files.getMeta() }
    }
}

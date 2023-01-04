import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AlreadyExistException from 'App/Exceptions/AlreadyExistException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import FileResource from 'App/Resources/File/FileResource'
import FileService from 'App/Services/FileService'
import CreateFileValidator from 'App/Validators/File/CreateFileValidator'

@inject()
export default class FilesController {

  constructor(private fileService: FileService) {
  }

  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page')
    const limit = request.input('limit')
    const { data: files, meta } = await this.fileService.getAllFiles({ page, limit })
    return response.json({ data: FileResource.collection(files), meta })
  }

  public async store({request, response, auth}: HttpContextContract) {
    await request.validate(CreateFileValidator)

    const { name, code, description } = request.body()

    const file = await this.fileService.getFileByCode(code)

    if(file !== null) {
      throw new AlreadyExistException('File record already exist')
    }
    
    const user = auth.user!

    await this.fileService.createFile({ name, code, description }, user)
    
    return response.created({
      success: true,
      message: 'File record was created successfully'
    })
  }

  public async show({ response, params }: HttpContextContract) {
    const file = await this.fileService.getFileById(params.id)

    if(file === null) {
      throw new NotFoundException('File record does not exist')
    }

    return response.json(FileResource.single(file))
  }

  public async update({}: HttpContextContract) {}

  public async destroy({request, response, auth, params}: HttpContextContract) {
    const file = await this.fileService.getFileById(params.id)

    if(file === null) {
      throw new NotFoundException('File record does not exist')
    }

    const user = auth.user!

    if(file.userId !== user.id) {
      throw new UnauthorizedException('File record cannot be deleted')
    }

    await this.fileService.deleteFile(file)

    return response.json({
      success: false,
      message: 'File record was deleted successfully'
    })
  }
}

import { inject } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { InventoryService } from '../../../Services'
import { AlreadyExistException } from '../../../Exceptions'
import { CreateInventoryValidator } from '../../../Validators'
import { InventoryResource } from '../../../Resources/Inventory/InventoryResource'
import NotFoundException from '../../../Exceptions/NotFoundException'

@inject()
export default class InventoriesController {
  /**
   *
   */
  constructor(private inventoryService: InventoryService) {}

  public async index({ request, response }: HttpContextContract) {
    const inventories = await this.inventoryService.getAllInventories()
    return response.json(InventoryResource.collection(inventories))
  }

  public async show({ params, response }: HttpContextContract) {
    const inventory = await this.inventoryService.getInventoryById(params.id)

    if (inventory === null) {
      throw new NotFoundException('Inventory record does not exist')
    }

    return response.json(InventoryResource.single(inventory))
  }

  public async store({ request, response }: HttpContextContract) {
    const { article, quantity, code } = request.body()

    await request.validate(CreateInventoryValidator)
    const inventory = await this.inventoryService.getInventoryByCode(code)

    if (inventory) {
      throw new AlreadyExistException('Inventory record already exists')
    }

    await this.inventoryService.createInventory({ article, quantity, code })

    return response.created({
      success: true,
      message: 'Inventory record was created successfully',
    })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const inventory = await this.inventoryService.getInventoryById(params.id)

    if (inventory === null) {
      throw new NotFoundException('Inventory record does not exist')
    }

    await this.inventoryService.deleteInventory(inventory)

    return response.json({
      success: true,
      message: 'Inventory record was deleted successfully',
    })
  }
}

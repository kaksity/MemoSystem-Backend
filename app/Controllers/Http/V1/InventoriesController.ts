import { inject } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InventoryService from 'App/Services/InventoryService'
import AlreadyExistException from 'App/Exceptions/AlreadyExistException'
import CreateInventoryValidator from 'App/Validators/Inventory/CreateInventoryValidator'
import UpdateInventoryValidator from 'App/Validators/Inventory/UpdateInventoryValidator'
import InventoryResource from 'App/Resources/Inventory/InventoryResource'
import NotFoundException from 'App/Exceptions/NotFoundException'
import {
  INVENTORY_DOES_NOT_EXIST,
  INVENTORY_LIST_RETRIEVED_SUCCESSFULLY,
  INVENTORY_DETAIL_RETRIEVED_SUCCESSFULLY,
  INVENTORY_CREATED_SUCCESSFULLY,
  INVENTORY_ALREADY_EXIST,
  INVENTORY_UPDATED_SUCCESSFULLY,
  INVENTORY_DELETED_SUCCESSFULLY,
} from 'App/Helpers/GeneralPurpose/CustomMessages/InventoryCustomMessages'
import { NULL_OBJECT } from 'App/Helpers/GeneralPurpose/CustomMessages/SystemCustomMessages'
import InventoryObjectInterface from 'App/TypeChecking/ModelManagement/InventoryObjectInterface'

@inject()
export default class InventoriesController {
  /**
   *
   */
  constructor(private inventoryService: InventoryService) {}

  public async index({ response }: HttpContextContract) {
    const inventories = await this.inventoryService.getAllInventories()

    return response.json({
      success: true,
      message: INVENTORY_LIST_RETRIEVED_SUCCESSFULLY,
      status_code: 200,
      data: InventoryResource.collection(inventories),
    })
  }

  public async show({ params, response }: HttpContextContract) {
    const inventory = await this.inventoryService.getInventoryById(params.id)

    if (inventory === NULL_OBJECT) {
      throw new NotFoundException(INVENTORY_DOES_NOT_EXIST)
    }

    return response.json({
      success: true,
      message: INVENTORY_DETAIL_RETRIEVED_SUCCESSFULLY,
      status_code: 200,
      data: InventoryResource.single(inventory),
    })
  }

  public async update({ request, response, params }: HttpContextContract) {
    await request.validate(UpdateInventoryValidator)

    const { article, quantity } = request.body()

    const inventory = await this.inventoryService.getInventoryById(params.id)

    if (inventory === null) {
      throw new NotFoundException('Inventory record does not exists')
    }

    const updateInventoryRecordPayloadOptions = {
      entityId: inventory.id,
      modifiedData: {
        article,
        quantity,
      },
      transaction: undefined,
    }

    await this.inventoryService.updateInventoryRecord(updateInventoryRecordPayloadOptions)

    return response.json({
      success: true,
      status_code: 200,
      message: INVENTORY_UPDATED_SUCCESSFULLY,
      data: null,
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const { article, quantity, code } = request.body()

    await request.validate(CreateInventoryValidator)
    let inventory = await this.inventoryService.getInventoryByCode(code)

    if (inventory) {
      throw new AlreadyExistException(INVENTORY_ALREADY_EXIST)
    }

    const createInventoryRecordOptions: Partial<InventoryObjectInterface> = {
      article,
      quantity,
      code,
    }

    inventory = await this.inventoryService.createInventoryRecord(createInventoryRecordOptions)
    const inventoryResponsePayload = InventoryResource.single(inventory)

    return response.created({
      success: true,
      status_code: 201,
      message: INVENTORY_CREATED_SUCCESSFULLY,
      data: inventoryResponsePayload,
    })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const inventory = await this.inventoryService.getInventoryById(params.id)

    if (inventory === null) {
      throw new NotFoundException(INVENTORY_DOES_NOT_EXIST)
    }

    const deleteInventoryRecordPayloadOptions = {
      entityId: inventory.id,
      transaction: undefined,
    }

    await this.inventoryService.deleteInventoryRecord(deleteInventoryRecordPayloadOptions)

    return response.json({
      success: true,
      status_code: 200,
      message: INVENTORY_DELETED_SUCCESSFULLY,
      data: null,
    })
  }
}

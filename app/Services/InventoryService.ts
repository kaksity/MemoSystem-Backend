import Inventory from 'App/Models/Inventory'
import InventoryObjectInterface from 'App/TypeChecking/ModelManagement/InventoryObjectInterface'
import { NULL_OBJECT } from '../Helpers/GeneralPurpose/CustomMessages/SystemCustomMessages'
import DeleteRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/DeleteRecordPayloadOptions'
import UpdateRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/UpdateRecordPayloadOptions'
export default class InventoryService {
  /**
   * @description
   * @author Dauda Pona
   * @param {Partial<InventoryObjectInterface>} createInventoryPayloadOptions
   * @returns {*}  {Promise<Inventory>}
   * @memberof InventoryService
   */
  public async createInventoryRecord(
    createInventoryPayloadOptions: Partial<InventoryObjectInterface>
  ): Promise<Inventory> {
    const { transaction } = createInventoryPayloadOptions

    const inventory = new Inventory()

    Object.assign(inventory, createInventoryPayloadOptions)

    if (transaction) {
      inventory.useTransaction(transaction)
    }

    await inventory.save()

    return inventory
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {string} code
   * @returns {*}  {(Promise<Inventory | null>)}
   * @memberof InventoryService
   */
  public async getInventoryByCode(code: string): Promise<Inventory | null> {
    const inventory = Inventory.query().where('code', code).first()

    if (inventory === NULL_OBJECT) {
      return NULL_OBJECT
    }

    return inventory
  }

  /**
   * @description
   * @author Dauda Pona
   * @returns {*}  {Promise<Inventory[]>}
   * @memberof InventoryService
   */
  public async getAllInventories(): Promise<Inventory[]> {
    return Inventory.all()
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {string} id
   * @returns {*}  {(Promise<Inventory | null>)}
   * @memberof InventoryService
   */
  public async getInventoryById(id: string): Promise<Inventory | null> {
    const inventory = Inventory.query().where('id', id).first()

    if (inventory === NULL_OBJECT) {
      return NULL_OBJECT
    }

    return inventory
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {DeleteRecordPayloadOptions} deleteInventoryRecordPayloadOptions
   * @returns {*}  {Promise<void>}
   * @memberof InventoryService
   */
  public async deleteInventoryRecord(
    deleteInventoryRecordPayloadOptions: DeleteRecordPayloadOptions
  ): Promise<void> {
    const { entityId, transaction } = deleteInventoryRecordPayloadOptions

    const inventory = await this.getInventoryById(entityId)

    if (transaction) {
      inventory!.useTransaction(transaction)
    }

    await inventory!.delete()
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {UpdateRecordPayloadOptions} updateInventoryRecordPayloadOptions
   * @returns {*}  {Promise<void>}
   * @memberof InventoryService
   */
  public async updateInventoryRecord(
    updateInventoryRecordPayloadOptions: UpdateRecordPayloadOptions
  ): Promise<void> {
    const { entityId, modifiedData, transaction } = updateInventoryRecordPayloadOptions

    const inventory = await this.getInventoryById(entityId)

    inventory!.merge(modifiedData)

    if (transaction) {
      inventory!.useTransaction(transaction)
    }

    await inventory!.save()
  }
}

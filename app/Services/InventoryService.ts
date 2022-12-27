import Inventory from 'App/Models/Inventory'
export default class InventoryService {
  /**
   * @description
   * @author Dauda Pona
   * @param {{
   *     article: string
   *     quantity: number
   *     code: string
   *   }} {
   *     article,
   *     quantity,
   *     code,
   *   }
   * @returns {*}  {Promise<Inventory>}
   * @memberof InventoryService
   */
  public async createInventory({
    article,
    quantity,
    code,
  }: {
    article: string
    quantity: number
    code: string
  }): Promise<Inventory> {
    return Inventory.create({ article, quantity, code })
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {string} code
   * @returns {*}  {(Promise<Inventory | null>)}
   * @memberof InventoryService
   */
  public async getInventoryByCode(code: string): Promise<Inventory | null> {
    return Inventory.findBy('code', code)
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
    return Inventory.findBy('id', id)
  }
/**
 * @description
 * @author Dauda Pona
 * @param {Inventory} inventory
 * @returns {*}  {Promise<void>}
 * @memberof InventoryService
 */
public async deleteInventory(inventory: Inventory): Promise<void> {
    await inventory.delete()
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {Inventory} inventory
   * @returns {*}  {Promise<void>}
   * @memberof InventoryService
   */
  public async updateInventory(inventory: Inventory): Promise<void> {
    await inventory.save();
  }
}

import Inventory from 'App/Models/Inventory'

interface InventoryInterface {
  id: string
  article: string
  quantity: number
  code: string
}
export default class InventoryResource {
  public static single(inventory: Inventory): InventoryInterface {
    return {
      id: inventory.id,
      article: inventory.article,
      quantity: inventory.quantity,
      code: inventory.code,
    }
  }

  public static collection(inventories: Inventory[]): InventoryInterface[] {
    return inventories.map((inventory) => {
      return this.single(inventory)
    })
  }
}

import { Inventory } from 'App/Models'

interface InventoryInterface {
  id: number
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

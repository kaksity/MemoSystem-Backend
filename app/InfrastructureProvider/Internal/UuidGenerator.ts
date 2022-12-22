import { v4 } from 'uuid'

export class UUIDGenerator {
  public static generate(): string {
    return v4()
  }
}

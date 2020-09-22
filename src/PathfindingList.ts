import { Square } from "./Square";

export interface ListEntry {
  square: Square;
  fscore: number;
  from: ListEntry | null;
}

export class PathfindingList {
  items: ListEntry[];
  constructor() {
    this.items = [];
  }

  put(item: ListEntry): void {
    this.items.push(item);
  }

  pop(): ListEntry {
    if (this.isEmpty()) {
      throw new Error("underflow");
    }
    return this.items.pop() as ListEntry;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
  sort(): void {
    this.items.sort((li1, li2) => {
      if (li1.fscore > li2.fscore) {
        return -1;
      } else if (li1.fscore < li2.fscore) {
        return 1;
      }
      return 0;
    });
  }
}

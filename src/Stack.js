// From https://github.com/ts-data/stack/blob/master/stack.ts
// See MIT license at https://github.com/ts-data/stack/blob/master/LICENSE
import Node from "./StackNode.js";

export default class Stack {

  _topNode = undefined;
  _count = 0;

  count() {
      return this._count;
  }

  isEmpty() {
      return this._topNode === undefined;
  }

  push(value) {
      // create a new Node and add it to the top
      const node = new Node(value, this._topNode);
      this._topNode = node;
      this._count++;
  }

  pop() {
      // remove the top node from the stack.
      // the node at the top now is the one before it
      const poppedNode = this._topNode;
      this._topNode = poppedNode.previous;
      this._count--;
      return poppedNode.data;
  }

  peek() {
      return this._topNode.data;
  }

}

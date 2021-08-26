// From https://github.com/ts-data/stack/blob/master/stack.ts
// See MIT license at https://github.com/ts-data/stack/blob/master/LICENSE
export default class Node {

  previous;
  data;

  constructor(data, previous) {
    this.previous = previous;
    this.data = data;
  }

}

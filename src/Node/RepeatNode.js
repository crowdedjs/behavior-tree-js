import BehaviorTreeStatus from "../BehaviorTreeStatus.js";
import NodeEnumerator from "../NodeEnumerator.js";

/**
 * Runs child nodes in sequence, until one fails.
 *
 * @property {string} name - The name of the node.
 */
export default class RepeatNode  {
  /**
   * List of child nodes.
   *
   * @type {BehaviorTreeNodeInterface[]}
   */
   children = [];

  /**
   * Enumerator to keep state
   */
   enumerator;
   name;
   keepState;

   constructor(  name,   keepState= false) {
     this.name = name;
     this.keepState = keepState;
  }

   init(){
    this.enumerator = new NodeEnumerator(this.children);
  }

   async tick(state){
    if (!this.enumerator || !this.keepState) {
      this.init();
    }

    if (!this.enumerator.current) {
      return BehaviorTreeStatus.Running;
    }
    
      do {
        const status = await this.enumerator.current.tick(state);
        if (status !== BehaviorTreeStatus.Success) {
          if (status === BehaviorTreeStatus.Failure) {
            this.enumerator.reset();
          }

          return BehaviorTreeStatus.Running;
        }

      } while (this.enumerator.next());
      this.enumerator.reset();
      
    

    return BehaviorTreeStatus.Running;
  }

   addChild(child) {
    this.children.push(child);
  }
}

import BehaviorTreeStatus from "../BehaviorTreeStatus.js";
import NodeEnumerator from "../NodeEnumerator.js";

/**
 * Selects the first node that succeeds. Tries successive nodes until it finds one that doesn't fail.
 *
 * @property {string} name - The name of the node.
 */
export default class SelectorNode  {
    /**
     * List of child nodes.
     *
     * @type {BehaviorTreeNodeInterface[]}
     */
     children= [];

    /**
     * Enumerator to keep state
     */
     enumerator;
     name;
     keepState;

     constructor(  name,   keepState = false) {
         this.name = name;
         this.keepState = keepState;
    }

     init() {
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
            if (status !== BehaviorTreeStatus.Failure) {
                if (status === BehaviorTreeStatus.Success) {
                    this.enumerator.reset();
                }

                return status;
            }

        } while (this.enumerator.next());
        this.enumerator.reset();

        return BehaviorTreeStatus.Failure;
    }

     addChild(child) {
        this.children.push(child);
    }
}

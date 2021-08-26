import BehaviorTreeStatus from "../BehaviorTreeStatus.js";
import BehaviorTreeError from "../Error/BehaviorTreeError.js";
import Errors from "../Error/Errors.js";

/**
 * Decorator node that inverts the success/failure of its child.
 *
 * @property {string} name - The name of the node
 */
export default class InverterNode {
    /**
     * The child to be inverted
     */
     childNode;
     name

     constructor(  name) {
         this.name = name;
    }

     async tick(state) {
        if (!this.childNode) {
            throw new BehaviorTreeError(Errors.INVERTER_NO_CHILDREN);
        }

        const result = await this.childNode.tick(state);
        if (result === BehaviorTreeStatus.Failure) {
            return BehaviorTreeStatus.Success;
        } else if (result === BehaviorTreeStatus.Success) {
            return BehaviorTreeStatus.Failure;
        }

        return result;
    }

     addChild(child) {
        if (!!this.childNode) {
            throw new BehaviorTreeError(Errors.INVERTER_MULTIPLE_CHILDREN);
        }

        this.childNode = child;
    }
}

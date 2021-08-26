import BehaviorTreeStatus from "../../src/BehaviorTreeStatus.js";
import StateData from "../../src/StateData.js";

export default interface BehaviorTreeNodeInterface {
    tick(state: StateData): Promise<BehaviorTreeStatus>;
}
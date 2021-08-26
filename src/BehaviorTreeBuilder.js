import BehaviorTreeStatus from "./BehaviorTreeStatus.js";
import BehaviorTreeError from "./Error/BehaviorTreeError.js";
import Errors from "./Error/Errors.js";
import ActionNode from "./Node/ActionNode.js";
import InverterNode from "./Node/InverterNode.js";
import ParallelNode from "./Node/ParallelNode.js";
import SelectorNode from "./Node/SelectorNode.js";
import RepeatNode from "./Node/RepeatNode.js"
import UntilFailNode from "./Node/UntilFailNode.js"
import SequenceNode from "./Node/SequenceNode.js";
import Stack from "./Stack.js";
import StateData from "./StateData.js";

export default class BehaviorTreeBuilder {
    /**
     * Last node created
     */
    curNode;

    /**
     * Stack node nodes that we are build via the fluent API.
     *
     * @type {Stack<ParentBehaviorTreeNodeInterface>}
     */
    parentNodeStack = new Stack();

    /**
     * Create an action node.
     *
     * @param {string} name
     * @param {(state: StateData) => BehaviorTreeStatus} fn
     * @returns {BehaviorTreeBuilder}
     */
    do(name, fn){
        if (this.parentNodeStack.isEmpty()) {
            throw new BehaviorTreeError(Errors.UNNESTED_ACTION_NODE);
        }

        const actionNode = new ActionNode(name, fn);
        this.parentNodeStack.peek().addChild(actionNode);

        return this;
    }

    /**
     * Like an action node... but the function can return true/false and is mapped to success/failure.
     *
     * @param {string} name
     * @param {(state: StateData) => boolean} fn
     * @returns {BehaviorTreeBuilder}
     */
     condition(name, fn) {
        return this.do(name, async (t) => await fn(t) ? BehaviorTreeStatus.Success : BehaviorTreeStatus.Failure);
    }

    /**
     * Create an inverter node that inverts the success/failure of its children.
     *
     * @param {string} name
     * @returns {BehaviorTreeBuilder}
     */
     inverter(name) {
        return this.addParentNode(new InverterNode(name));
    }

    /**
     * Create a sequence node.
     *
     * @param {string}  name
     * @param {boolean} keepState
     * @returns {BehaviorTreeBuilder}
     */
     sequence(name, keepState = true) {
        return this.addParentNode(new SequenceNode(name, keepState));
    }

    /**
     * Create a parallel node.
     *
     * @param {string} name
     * @param {number} requiredToFail
     * @param {number} requiredToSucceed
     * @returns {BehaviorTreeBuilder}
     */
     parallel(name, requiredToFail, requiredToSucceed) {
        return this.addParentNode(new ParallelNode(name, requiredToFail, requiredToSucceed));
    }

    /**
     * Create a selector node.
     *
     * @param {string}  name
     * @param {boolean} keepState
     * @returns {BehaviorTreeBuilder}
     */
     selector(name, keepState) {
        return this.addParentNode(new SelectorNode(name, keepState));
    }

    /**
     * Create a repeat node.
     *
     * @param {string}  name
     * @param {boolean} keepState
     * @returns {BehaviorTreeBuilder}
     */
     repeat(name, keepState = true) {
        return this.addParentNode(new RepeatNode(name, keepState));
    }

    /**
     * Create a until fail node.
     *
     * @param {string}  name
     * @param {boolean} keepState
     * @returns {BehaviorTreeBuilder}
     */
     untilFail(name, keepState = true) {
        return this.addParentNode(new UntilFailNode(name, keepState));
    }

    /**
     * Splice a sub tree into the parent tree.
     *
     * @param {BehaviorTreeNodeInterface} subTree
     * @returns {BehaviorTreeBuilder}
     */
     splice(subTree) {
        if (this.parentNodeStack.isEmpty()) {
            throw new BehaviorTreeError(Errors.SPLICE_UNNESTED_TREE);
        }

        this.parentNodeStack.peek().addChild(subTree);

        return this;
    }

    /**
     * Build the actual tree
     * @returns {BehaviorTreeNodeInterface}
     */
     build() {
            if (!this.curNode) {
                throw new BehaviorTreeError(Errors.NO_NODES);
            }

            return this.curNode;
    }

    /**
     * Ends a sequence of children.
     *
     * @returns {BehaviorTreeBuilder}
     */
     end() {
        this.curNode = this.parentNodeStack.pop();

        return this;
    }

    /**
     * Adds the parent node to the parentNodeStack
     *
     * @param {ParentBehaviorTreeNodeInterface} node
     * @returns {BehaviorTreeBuilder}
     */
     addParentNode(node) {
        if (!this.parentNodeStack.isEmpty()) {
            this.parentNodeStack.peek().addChild(node);
        }

        this.parentNodeStack.push(node);

        return this;
    }
}

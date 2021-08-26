import BehaviorTreeStatus from "../BehaviorTreeStatus.js";

/**
 * Runs child's nodes in parallel.
 *
 * @property {string} name                 - The name of the node.
 * @property {number} requiredToFail    - Number of child failures required to terminate with failure.
 * @property {number} requiredToSucceed - Number of child successes required to terminate with success.
 */
export default class ParallelNode  {
    /**
     * List of child nodes.
     *
     * @type {BehaviorTreeNodeInterface[]}
     */
     children = [];
     name;
     requiredToFail;
     requiredToSucceed;

     constructor(
          name,
          requiredToFail,
          requiredToSucceed,
    ) {
        this.name = name;
        this.requiredToFail = requiredToFail;
        this.requiredToSucceed = requiredToSucceed;
    }

     async tick(state) {
        const statuses = await Promise.all(this.children.map((c) => this.tickChildren(state, c)));
        const succeeded                      = statuses.filter((x) => x === BehaviorTreeStatus.Success).length;
        const failed                         = statuses.filter((x) => x === BehaviorTreeStatus.Failure).length;

        if (this.requiredToSucceed > 0 && succeeded >= this.requiredToSucceed) {
            return BehaviorTreeStatus.Success;
        }
        if (this.requiredToFail > 0 && failed >= this.requiredToFail) {
            return BehaviorTreeStatus.Failure;
        }

        return BehaviorTreeStatus.Running;
    }

     addChild(child) {
        this.children.push(child);
    }

     async tickChildren(state, child){
        try {
            return await child.tick(state);
        } catch (e) {
            return BehaviorTreeStatus.Failure;
        }
    }
}

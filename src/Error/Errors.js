class Errors {
    static NO_NODES                   = "Cannot create a behavior tree with zero nodes."
    static SPLICE_UNNESTED_TREE       = "Cannot splice an unnested sub-tree. There must be a parent-tree."
    static INVERTER_NO_CHILDREN       = "InverterNode must have a child node!"
    static INVERTER_MULTIPLE_CHILDREN = "Can't add more than a single child to InverterNode!"
    static UNNESTED_ACTION_NODE       = "Can't create an unnested ActionNode. It must be a leaf node."
    static NO_RETURN_VALUE            = "Node must return a BehaviorTreeStatus"
}

export default Errors;

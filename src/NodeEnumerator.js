
export default class NodeEnumerator {
     currentIndex = 0;

     get current() {
        return this.nodes[this.currentIndex];
    }

     constructor( nodes) {
        this.nodes = nodes;
    }

     [Symbol.iterator](){
        return {
            next: ()=> {
                let result;

                if (this.currentIndex < this.nodes.length) {
                    result = {value: this.current, done: false};
                    this.next();
                } else {
                    result = {done: true};
                }

                return result;
            },
        };
    }

     next() {
        if (this.hasNext()) {
            this.currentIndex++;

            return true;
        }

        return false;
    }

     hasNext() {
        return !!this.nodes[this.currentIndex + 1];
    }

     reset() {
        this.currentIndex = 0;
    }
}

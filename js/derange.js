(function() {
//MAKE THE WHOLE THING AN 'IIFE' TO BE ABLE TO RUN MORE THAN ONCE WITHOUT GETTING 
//Uncaught SyntaxError: Identifier 'NODE_TYPE', 'getAllTextNodes', etc. has already been declared

const NODE_TYPE = {
    TEXT: {index: 1, description: "text"},
    INPUT: {index: 2, description: "input"},
    IMAGE: {index: 3, description: "image"}
}

const getAllTextNodes = function getAllTextNodes() {
    const walker = document.createTreeWalker(
        document.body, 
        NodeFilter.SHOW_TEXT, 
        {
            acceptNode: function(node) {
                switch(node.parentNode.nodeName) {
                    case "SCRIPT":
                    case "STYLE":
                        return NodeFilter.FILTER_SKIP; 
                    break;
                }
                return NodeFilter.FILTER_ACCEPT; 
            } 
        },

    );

    let node;
    const textNodes = [];

    while(node = walker.nextNode()) {
        const trimmedText = node.nodeValue.trim(); //trim() removes all whitespaces e.g. tab, NL, space.
        if(trimmedText.length) {
            textNodes.push(node);
        }
    }

    //console.log(textNodes.map(node => node.nodeValue));

    return textNodes;
};

const getAllInputNodes = function getAllInputNodes() {
    const walker = document.createTreeWalker(
        document.body, 
        NodeFilter.SHOW_ELEMENT, 
        {
            acceptNode: function(node) {
                if(node.nodeName === "INPUT") {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_SKIP;
            } 
        },

    );

    let node;
    const nodes = [];

    while(node = walker.nextNode()) {
        const trimmedText = node.value.trim(); //trim() removes all whitespaces e.g. tab, NL, space.
        if(trimmedText.length) {
            nodes.push(node);
        }
    }

    //console.log(nodes.map(node => node.value));

    return nodes;
};

const getAllImageNodes = function getAllImageNodes() {
    const walker = document.createTreeWalker(
        document.body, 
        NodeFilter.SHOW_ELEMENT, 
        {
            acceptNode: function(node) {
                if(node.nodeName === "IMG") {
                    return NodeFilter.FILTER_ACCEPT;
                } else if(node.nodeName.toUpperCase() === "SVG") {
                    return NodeFilter.FILTER_ACCEPT;
                } 
                return NodeFilter.FILTER_SKIP;
            } 
        },

    );

    let node;
    const nodes = [];

    while(node = walker.nextNode()) {
        nodes.push(node);
    }

    //console.log(nodes.map(node => node.src));

    return nodes;
};

const swapNodes = function swapNodes(nodeOne, nodeTwo) {
    const parentTwo = nodeTwo.parentNode;
    nodeOne.replaceWith(nodeTwo);
    parentTwo.appendChild(nodeOne);
};

const swapValues = function swapNodes(nodeOne, nodeTwo) {
    const valueOne = nodeOne.value;
    nodeOne.value = nodeTwo.value;
    nodeTwo.value = valueOne;
};

const swapSrc = function swapSrc(nodeOne, nodeTwo) {
    const srcOne = nodeOne.src;
    nodeOne.src = nodeTwo.src;
    nodeTwo.src = srcOne;
};

const derange = function derange(nodeArray, nodeType) {
    let nodeCount = nodeArray.length;

    if(nodeCount < 2) {
        console.log("Not enough " + nodeType.description + " nodes available to perform derangement :(");
        return;
    }

    for (let lastUnswappedIndex = nodeCount - 1; lastUnswappedIndex > 0; lastUnswappedIndex--) {

        let randomSwapIndex;
        randomSwapIndex = Math.floor( Math.random() * lastUnswappedIndex );

        // swap two elements of the nodeArray
        switch(nodeType.index) {
            case NODE_TYPE.TEXT.index:
                swapNodes(nodeArray[lastUnswappedIndex], nodeArray[randomSwapIndex]);
            break;
            case NODE_TYPE.INPUT.index:
                swapValues(nodeArray[lastUnswappedIndex], nodeArray[randomSwapIndex]);
            break;
            case NODE_TYPE.IMAGE.index:
                swapNodes(nodeArray[lastUnswappedIndex], nodeArray[randomSwapIndex]);
            break;
        }
    }
};

const derangeWrapper = function derangeWrapper() {
    derange(getAllTextNodes(), NODE_TYPE.TEXT);
    derange(getAllInputNodes(), NODE_TYPE.INPUT);
    derange(getAllImageNodes(), NODE_TYPE.IMAGE);
};

let globalContext = (typeof window !== "undefined") ? window : global;
if (typeof globalContext.derangeIntervalId === "undefined" || globalContext.derangeIntervalId === null) {
    derangeWrapper(); //dearrange immediately for first time because setInterval() has a delayed startup
    const intervalInSeconds = 2 * 1000;
    let repetitionsCounter = 0;
    const repetitionsLimit = 60;
    globalContext.derangeIntervalId = setInterval(
        function() {
            //console.log("Track execution: repetitionsCounter=", repetitionsCounter, " repetitionsLimit= ", repetitionsLimit, " intervalInSeconds=", intervalInSeconds);
            if(++repetitionsCounter > repetitionsLimit) {
                clearInterval(globalContext.derangeIntervalId);
                globalContext.derangeIntervalId = null;
            } else {
                derangeWrapper();
            }
        },
        intervalInSeconds);
} else {
    clearInterval(globalContext.derangeIntervalId);
    globalContext.derangeIntervalId = null;
}
})();



import { BinaryHeap } from './heap.js';

onload = function () {
    // create a network
    let curr_data;
    const container = document.getElementById('mynetwork');
    const container2 = document.getElementById('mynetwork2');
    const genNew = document.getElementById('generate-graph');
    const solve = document.getElementById('solve');
    const temptext = document.getElementById('temptext');
    // initialise graph options
    const options = {
        edges: {
            arrows: {
                to: true
            },
            labelHighlightBold: true,
            font: {
                size: 20
            }
        },
        nodes: {
            font: '12px arial red',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf3c5',
                size: 30,
                color: '#991133',
            }
        }
    };
    // initialize your network!
    let network = new vis.Network(container);
    network.setOptions(options);
    let network2 = new vis.Network(container2);
    network2.setOptions(options);

    function createData() {
        const sz = Math.floor(Math.random() * 8) + 2;
        const cities = ['Delhi', 'Mumbai', 'Kolkata', 'Kanpur', 'Jaipur', 'Darjeeling', 'Chennai', 'Bangalore', 'Mnagalore', 'Jodhpur'];
        const V = Math.floor(Math.random() * cities.length) + 1;

        // Preparing node data for vis.js
        let nodes = [];
        for (let i = 0; i < V; i++) {
            nodes.push({
                id: i, label: cities[i]
            })
        }
        nodes = new vis.DataSet(nodes);

        // Dynamically creating edges with random amount to be paid from one to another friend
        const edges = [];
        for (let i = 0; i < V; i++) {
            for (let j = i + 1; j < V; j++) {
                // Modifies the amount of edges added in the graph
                if (Math.random() > 0.5) {
                    // Controls the direction of cash flow on edge
                    if (Math.random() > 0.5)
                        edges.push({ from: i, to: j, label: String(Math.floor(Math.random() * 100) + 1) });
                    else
                        edges.push({ from: j, to: i, label: String(Math.floor(Math.random() * 100) + 1) });
                }
            }
        }
        const data = {
            nodes: nodes,
            edges: edges
        };
        return data;
    }

    genNew.onclick = function () {
        const data = createData();
        curr_data = data; // data is copied to curr_data
        // as after solving it will be changed
        network.setData(data);
        temptext.style.display = "inline";
        container2.style.display = "none";
    };

    function solveData() {
        let data = curr_data;
        const V = data['nodes'].length;
        const vals = Array(V).fill(0);

        // Calculating net balance of each person
        for (let i = 0; i < data['edges'].length; i++) {
            const edge = data['edges'][i];
            vals[edge['to']] += parseInt(edge['label']);
            vals[edge['from']] -= parseInt(edge['label']);
        }

        const pos_heap = new BinaryHeap();
        const neg_heap = new BinaryHeap();

        for (let i = 0; i < V; i++) {
            if (vals[i] > 0) {
                pos_heap.insert([vals[i], i]);
            } else{
                neg_heap.insert([-vals[i], i]);
                vals[i] *= -1;
            }
        }

        const new_edges = [];
        while (!pos_heap.empty() && !neg_heap.empty()) {
            const maxPos = pos_heap.extractMax();
            const maxNeg = neg_heap.extractMax();

            const amt = Math.min(maxPos[0], maxNeg[0]);

            new_edges.push({
                from: maxNeg[1],
                to: maxPos[1],
                label: String(Math.abs(amt))
            });

            const from = maxNeg[1];
            const to = maxPos[1];

            // vals[from] -= amt;
            // vals[to] -= amt;
            let x = maxPos[0] - amt;
            let y = maxNeg[0] - amt;

            if (maxPos[0] > maxNeg[0]) {
                pos_heap.insert([x, maxPos[1]]);
            } else if (maxPos[0] < maxNeg[0]) {
                neg_heap.insert([y, maxNeg[1]]);
            }
        }

        data = {
            nodes: data['nodes'],
            edges: new_edges
        };

        return data;

    }

    solve.onclick = function () {
        temptext.style.display = "none";
        container2.style.display = "inline";
        const solvedData = solveData();
        network2.setData(solvedData);
    }

    genNew.click();

};
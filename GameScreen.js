const gameGrid = document.querySelector(".gameGrid");

// Size of grid
const gridX = 3, gridY = 3;

// Desired end grid
const correctOrder = [];
for (let i = 1; i < gridX*gridY; i++)
{
    correctOrder.push(i);
}
correctOrder.push("");

console.log(correctOrder);
// Create an array of numbers that will make a solvable puzzle
const numberOrder = ["",2,7,4,1,3,5,6,8];


// Get walls and corners of puzzle
const walls = {"left":[], "top":[], "right":[], "bottom":[]};
const corners = {"top-left":0, "top-right":gridX-1, "bottom-left":gridX*(gridY-1), "bottom-right":gridX*gridY-1};
let count = 0;
for (let y = 0; y < gridY; y++)
{
    for (let x = 0; x < gridX; x++)
    {
        if (y == 0)
        {
            if (!Object.values(corners).includes(count)) walls["top"].push(count);
        }
        else if (y == gridY-1)
        {
            if (!Object.values(corners).includes(count)) walls["bottom"].push(count);
        }
        else{
            if (x == 0) walls["left"].push(count);
            if (x == gridX-1) walls["right"].push(count);
        }
        count++;
    }
}
console.log(walls);
console.log(corners);

let column1 = [0, 3, 6];
let column2 = [1, 4, 7];
let column3 = [2, 5, 8];
let row1 = [0, 1, 2];
let row2 = [3, 4, 5];
let row3 = [6, 7, 8];

// Create and add squares to the grid
for (let i = 0; i < gridX*gridY; i++)
{
    const gameSquare = document.createElement("div");
    gameSquare.classList.add("gameSquare");

    if (numberOrder[i] == "")  gameSquare.style.backgroundColor = "whitesmoke";
    if (column1.includes(i)) gameSquare.classList.add("column1");
    else if (column2.includes(i)) gameSquare.classList.add("column2");
    else gameSquare.classList.add("column3");
    
    if (row1.includes(i)) gameSquare.classList.add("row1");
    else if (row2.includes(i)) gameSquare.classList.add("row2");
    else gameSquare.classList.add("row3");

    console.log(gameSquare.className);

    gameSquare.innerText = numberOrder[i];
    gameSquare.style.width = `calc(100% / ${gridX})`;
    gameSquare.style.height = `calc(100% / ${gridY})`;
    gameSquare.style.order = i+1;
    gameGrid.appendChild(gameSquare);
}

// Algorithm for solving the puzzle
function solvePuzzle()
{
    let solution = BFSSlider(numberOrder, correctOrder);
    solution.push(correctOrder);
    console.log(solution);

    // Move them
    for (let i = 1; i < solution.length; i++)
    {
        setTimeout(() => {
            let swap = [];
            let orderedChildren = Array.from(gameGrid.children).sort((a,b) => parseInt(a.style.order) - parseInt(b.style.order));
            console.log(orderedChildren);
            for (j = 0; j < solution[i].length; j++)
            {
                let square = orderedChildren[j];

                if (square.innerText != solution[i][j])
                    swap.push(square);
            }
            // Swap their orders and their positions
            temp = swap[0].style.order;
            swap[0].style.order = swap[1].style.order;
            swap[1].style.order = temp;

            temp = swap[0].classList.value;
            swap[0].classList.value = swap[1].classList.value;
            swap[1].classList.value = temp;

        }, i*1000);
    }
}


function findNeighbors(square, currentState) {

    // Check if this square is a neighbor or wall
    let foundWall = Object.entries(walls).find(([key, value]) => {
        if (value.includes(square)) return key;
    });
    let foundCorner = Object.entries(corners).find(([key, value]) => {
        if (value == square) return key;
    });

    // Copy the current array
    let copy = [...currentState]

    // Default value - Square is neither a neighbor or wall
    let neighbors = [square+gridX, square-gridX, square+1, square-1];

    if (foundWall)
    {
        switch(foundWall[0])
        {
            case "left": neighbors = [square-gridX, square+1, square+gridX]; break;
            case "right": neighbors = [square-gridX, square-1, square+gridX]; break;
            case "top": neighbors = [square+gridX, square+1, square-1]; break;
            case "bottom": neighbors = [square-gridX, square+1, square-1]; break;
        }
    }

    if (foundCorner)
    {
        switch(foundCorner[0])
        {
            case 'top-left': neighbors = [square+1, square+gridX]; break;
            case "top-right": neighbors = [square-1, square+gridX]; break;
            case "bottom-left": neighbors = [square+1, square-gridX]; break;
            case "bottom-right": neighbors = [square-1, square-gridX]; break;
        }
    }
    
    let moves = [];

    for (let neighbor of neighbors)
    {
        // Switch values
        [copy[square], copy[neighbor]] = [copy[neighbor], copy[square]];
        // Add to moves
        moves.push([...copy]);
        // Switch them again to go back to original
        [copy[square], copy[neighbor]] = [copy[neighbor], copy[square]];
    }
    
    return moves
}

function BFSSlider(initialState, targetState) {
    const queue = [];
    const visited = new Set();
    const parent = new Map(); // Map to store parent state for each visited state

    queue.push(initialState);
    visited.add(initialState.join(','));

    while (queue.length > 0) {
        const currentState = queue.shift();
        let blank = currentState.indexOf("");


        // Check if the current state is the target state
        if (currentState.join(',') === targetState.join(',')) {

            // Reconstruct moves taken to get to this state
            const moves = [];
            let state = currentState;
            
            while (state.join(',') !== initialState.join(',')) {
                const prevState = parent.get(state);
                moves.push(prevState);
                state = prevState;
            }
            // Reverse the moves to get the correct order
            moves.reverse();
            return moves;
        }

        // Generate neighboring states
        const neighbors = findNeighbors(blank, currentState);

        // Enqueue unvisited neighbors
        for (const neighbor of neighbors) {
            const neighborString = neighbor.join(',');
            if (!visited.has(neighborString)) {
                queue.push(neighbor);
                visited.add(neighborString);
                parent.set(neighbor, currentState);
            }
        }
    }

    // If no solution found
    return null;
}
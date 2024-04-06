const gameGrid = document.querySelector(".gameGrid");

// Size of grid
const gridX = 3, gridY = 3;

// Desired end grid
const correctOrder = [];
for (let i = 1; i < gridX*gridY-1; i++)
{
    correctOrder.push(i);
}

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

// Create and add squares to the grid
for (let i = 0; i < gridX*gridY; i++)
{
    const gameSquare = document.createElement("div");
    gameSquare.className = "gameSquare";
    gameSquare.innerText = numberOrder[i];
    gameSquare.style.width = `calc(100% / ${gridX})`;
    gameSquare.style.height = `calc(100% / ${gridY})`;
    gameGrid.appendChild(gameSquare);
}

// Algorithm for solving the puzzle
let blank = numberOrder.indexOf("");
console.log(blank);
let neighbors = findNeighbors(blank);
console.log(neighbors);

function findNeighbors(square) {

    // Check if this square is a neighbor or wall
    let foundWall = Object.entries(walls).find(([key, value]) => value === square);
    let foundCorner = Object.entries(walls).find(([key, value]) => value === square);
    let corner = foundEntry[0];

    switch(foundWall[0])
    {
        case "left": return [foundWall[1]-gridX, foundWall[1]+1, foundWall[1]+gridX];
        case "right": return [foundWall[1]-gridX, foundWall[1]-1, foundWall[1]+gridX];
        case "top": return [foundWall[1]-1, foundWall[1]+1, foundWall[1]+gridX];
        case "bottom": return [foundWall[1]-1, foundWall[1]+1, foundWall[1]-gridX];
    }
    switch(foundCorner[0])
    {
        case "top-left": return [foundCorner[1]-gridX, foundCorner[1]+1];
        case "top-right": return [foundCorner[1]-gridX, foundCorner[1]-1];
        case "bottom-left": return [foundCorner[1]+1, foundCorner[1]-gridX];
        case "bottom-right": return [foundCorner[1]-1, foundCorner[1]+1, foundCorner[1]-gridX];
    }

    return ;
}
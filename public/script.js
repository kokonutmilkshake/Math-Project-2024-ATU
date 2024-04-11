function getPartialSum(diceSidesNum) {
    if (diceSidesNum <= 0) {
        return null; // Handle non-positive inputs (optional)
    }
    return diceSidesNum * diceSidesNum - (diceSidesNum - 1) * (diceSidesNum - 1);
}

const form = document.getElementById('dice-sim-form');

form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    const diceSidesNum = parseInt(document.getElementById('diceSidesNum').value);
    const simulationCount = parseInt(document.getElementById('simulationCount').value);
    const countArray = new Array(getPartialSum(diceSidesNum)).fill(0);
    const rollNumArray = Array.from({ length: diceSidesNum * 2 - 1 }, (_, i) => i + 2); // Improved rollNumArray generation

    for (let i = 0; i < simulationCount; i++) {
        const roll1 = Math.floor(Math.random() * diceSidesNum) + 1; // Adjusted for 1-based indexing
        const roll2 = Math.floor(Math.random() * diceSidesNum) + 1;
        const sum = roll1 + roll2;
        countArray[sum - 2]++;
    }

    d3.select("svg").remove();

    const svg = d3.select("div").append("svg") // Or select an existing SVG element if needed
        .attr("width", 500)
        .attr("height", 300);

    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = svg.attr("width") - margin.left - margin.right;
    const height = svg.attr("height") - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
        .domain(rollNumArray)
        .range([margin.left, width + margin.left])
        .padding(0.1); // Adjust padding as needed

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(countArray)]) // Set domain based on your countArray values
        .range([height, margin.top]);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add bars
    g.selectAll("rect")
        .data(countArray)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(rollNumArray[i]))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d))
        .attr("fill", "steelblue");

    // Add x-axis labels
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    // Add y-axis labels (optional)
    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yScale));

    // Add axis titles (optional)
    svg.append("text")
        .attr("class", "axis-title axis-title--x")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
        .text("Sum of Two Dice Rolls");

    svg.append("text")
        .attr("class", "axis-title axis-title--y")
        .attr("transform", `translate(${margin.left - 40}, ${height / 2}) rotate(-90)`)
        .text("Number of Occurrences");
});


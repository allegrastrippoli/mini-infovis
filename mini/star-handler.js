const color = d3.scaleOrdinal(d3.schemeCategory10);
const spikes = 5;
const outerRadius = 20;
const innerRadius = 10;
const width = window.innerWidth;
const height = window.innerHeight;

function starPoints(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;
    let path = "";

    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy - Math.sin(rot) * outerRadius;
        path += `${x},${y} `;
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy - Math.sin(rot) * innerRadius;
        path += `${x},${y} `;
        rot += step;
    }

    return path;
}


d3.json('stars.json').then(coordinates => {
    const x_max = Math.max(
        ...coordinates.map(coord => Math.max(coord.x1, coord.x2, coord.x3))
    );
    const y_max = Math.max(
        ...coordinates.map(coord => Math.max(coord.y1, coord.y2, coord.y3))
    );

    const xScale = d3.scaleLinear().domain([0, x_max]).range([2 * outerRadius, width - 2 * outerRadius]);
    const yScale = d3.scaleLinear().domain([0, y_max]).range([2 * outerRadius, height - 2 * outerRadius]);

    const svgContainer = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    const stars = svgContainer.selectAll("polygon")
        .data(coordinates)
        .enter()
        .append("polygon");

    stars
        .attr("points", d => starPoints(xScale(d.x1), yScale(d.y1), spikes, outerRadius, innerRadius))
        .style("fill", d => color(d.id));

    let num_click = 0;

    svgContainer.on("click", (click) => {
        num_click++;

        stars.each(function (d) {
            let nextx, nexty;

            if (num_click === 1) {
                nextx = d.x2;
                nexty = d.y2;
            } else if (num_click === 2) {
                nextx = d.x3;
                nexty = d.y3;
            } else {
                nextx = d.x1;
                nexty = d.y1;
                num_click = 0;
            }

            d3.select(this)
                .transition()
                .duration(2000)
                .attr("points", starPoints(xScale(nextx), yScale(nexty), spikes, outerRadius, innerRadius));
        });
    });
});

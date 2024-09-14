function main() {

    const coordinates = [
        {id: 0, x1: 564, y1: 807, x2: 145, y2: 538, x3: 726, y3: 130},
        {id: 1, x1: 272, y1: 509, x2: 698, y2: 594, x3: 489, y3: 837},
        {id: 2, x1: 72, y1: 928, x2: 806, y2: 932, x3: 664, y3: 939},
        {id: 3, x1: 453, y1: 687, x2: 32, y2: 0, x3: 473, y3: 194},
        {id: 4, x1: 372, y1: 741, x2: 783, y2: 411, x3: 520, y3: 303},
        {id: 5, x1: 618, y1: 781, x2: 34, y2: 266, x3: 5, y3: 959},
        {id: 6, x1: 773, y1: 350, x2: 780, y2: 814, x3: 223, y3: 598},
        {id: 7, x1: 648, y1: 116, x2: 715, y2: 692, x3: 862, y3: 75},
        {id: 8, x1: 607, y1: 572, x2: 491, y2: 590, x3: 419, y3: 855},
        {id: 9, x1: 377, y1: 837, x2: 377, y2: 467, x3: 323, y3: 358},
    ]

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const spikes = 5
    const outerRadius = 20
    const innerRadius = 10
    const width = window.innerWidth;
    const height = window.innerHeight;

    const x_max = Math.max(
        ...coordinates.map(coord => Math.max(coord.x1, coord.x2, coord.x3))
    );
    const y_max = Math.max(
        ...coordinates.map(coord => Math.max(coord.y1, coord.y2, coord.y3))
    );

    const xScale = d3.scaleLinear().domain([0, x_max]).range([2 * outerRadius, width - 2 * outerRadius]);
    
    const yScale = d3.scaleLinear().domain([0, y_max]).range([2 * outerRadius, height - 2 * outerRadius]);

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

    d3.selectAll("svg").on("click", (click) => {
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
                .attr("points", starPoints(xScale(nextx), yScale(nexty), spikes, outerRadius, innerRadius));
        });
    });
}


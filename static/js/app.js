
function buildMetadata(data) {

    var url = "/metadata/" + data;
    d3.json(url).then((metadataObj) => 
    {
        var Metadata = d3.select("#sample-metadata");
        Metadata.html("");
        Object.keys(metadataObj).forEach(function (key) 
        {
            var datadisplay = key + ": " + metadataObj[key];
            Metadata.append("div").text(datadisplay)
        });
    });
}


function buildCharts(sample) {

    var url = "/samples/" + sample;

    // Build Pie Chart
    d3.json(url).then(function (data) {
        
        var trace = {
            labels: data.otu_ids.slice(0, 10),
            values: data.sample_values.slice(0, 10),
            hoverinfo: data.otu_labels.slice(0, 10),
            type: 'pie'
        };
        var data = [trace];
        var layout = {
            height: 475,
            width: 475
        };
        Plotly.newPlot("pie", data, layout);

    });

    // Build Bubble chart
    d3.json(url).then(function (data) {
        var trace = {
            x: data.out_ids,
            y: data.sample_values,
            text: data.otu_labels,
            mode: 'markers',
            marker: {
                color: data.otu_ids,
                size: data.sample_values
            }
        };
        var data = [trace];

        var layout = {
            showlegend: false,
            height: 500,
            width: 1200
        };
        Plotly.newPlot("bubble", data, layout);
    });
}


function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
            console.log("sample", sample)
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
        buildGaugeChart(firstSample);
    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
    buildGaugeChart(newSample);
}

// Initialize the dashboard
init();
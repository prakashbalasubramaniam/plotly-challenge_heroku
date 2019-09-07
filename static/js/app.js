function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    // Original string
  let url_buildMetadata = '/metadata/'; 
  // Joining the strings together 
  url_buildMetadata = url_buildMetadata.concat(sample);
  d3.json(url_buildMetadata).then((data) => {
    console.log(data);

    // Use `.html("") to clear any existing metadata
    let metadata_panel = d3.select("#sample-metadata");
    metadata_panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata. data.length
    Object.entries(data).forEach(([key, value]) => { 
      console.log(`${key}: ${value}`);        
      metadata_panel.append("p").text(`${key}: ${value}`);                   
    });
    
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    var data = [{domain: {x: [0, 1], y: [0, 1]}, value: data.WFREQ, 
      title: {text: "Belly Button Washing Frequency Scrubs Per Week", font: {size: 15}},
      type: "indicator", mode: "gauge+number+delta",
      delta: {reference: 9, increasing: {color: "RebeccaPurple"}},
      gauge: {axis: {range: [0, 9]}}, 
      //steps: [{range: [0, 4.5], color: "lightgray"}, {range: [4.5, 9], color: "gray"}]
    }];

    var layout = {width: 400, height: 300, margin: {t: 0, b: 0}};
    Plotly.newPlot("gauge",data,layout);    
  });
}

function buildCharts(sample) {
  console.log(sample)
  // Original string 
  let url_buildCharts = '/samples/'; 
  
  // Joining the strings together 
  url_buildCharts = url_buildCharts.concat(sample); 

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url_buildCharts).then((data) => {
    console.log(data)

    // @TODO: Build a Bubble Chart using the sample data    
    let trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {
        color: data.otu_ids,
        size: data.sample_values
      }
    };
    
    let plot_data = [trace1];
    
    let layout = {
      title: 'OTU ID',
      showlegend: false,
      height: 600,
      width: 1200
    };
    
    Plotly.newPlot('bubble', plot_data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
   
    let trace2 = [{
      values: data.sample_values.slice(0,10),
      labels: data.otu_ids.slice(0,10),
      type: 'pie'
    }];
    
    let layout2 = {
      height: 400,
      width: 500
    };
    
    Plotly.newPlot('pie', trace2, layout2);
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    console.log(firstSample)
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

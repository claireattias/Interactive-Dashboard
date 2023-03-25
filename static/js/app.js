// use D3 library to read samples.json 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// data promise (easier so you don't have to type a lot)
// const dataPromise = d3.json(url);
// to fetch using promise
// dataPromise.json(url).then(data => {
    // console.log(data);
 //  });

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
  });

// open with live server and you can inspect the page to grab data   
// have to grab data before you can make plots (data is test subject id number)
function init() {
  // reference the dropdown to select subject id
  let selector = d3.select("#selDataset");

  // use list of subject ids to populate the select options
  d3.json(url).then((data) => {
    let sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // use first sample to build initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// initialize dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time sample selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// demographics panel
function buildMetadata(sample) {
  d3.json(url).then((data) => {
    let metadata = data.metadata;
    // filter data for sample with desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    
    // select space in demogrpahic info with id of 'sample-metadata'
    let panel = d3.select("#sample-metadata");
    
    // clear existing metadata
    panel.html("");
    
    // add each key and value pair to the space under demographic info
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// create buildCharts function
function buildCharts(sample) {
  // load and retrieve "samples" from json file
  d3.json(url).then((data) => {
    // create variable to hold sample data
    let samples = data.samples;
    // create variable to filter samples with desired sample number
    let sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    // create varaible to hold first value
    let result = sampleArray[0];

    // create variables to hold sample_values, otu_ids, and otu_labels (top 10 descending order)
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels.slice(0,10).reverse();
    let sample_values = result.sample_values.slice(0,10).reverse();

    let bubbleLabels = result.otu_labels;
    let bubbleValues = result.sample_values;

    // create yticks for horizontal bar chart (map() to filter and parse data)
    let yticks = otu_ids.map(sampleObj => "OTU" + sampleObj).slice(0,10).reverse();
    console.log(yticks)
    
    // create trace for the bar chart
    let trace1 = [{
      x: sample_values,
      y: yticks,
      text: otu_labels,
      type: "bar",
      orientation: "h"
    }];

    // create layout for the bar chart
    let layout1 = {
      title: "Top 10 Bacteria Cultures Found"
    };

    // use Plotly to plot data
    Plotly.newPlot("bar", trace1, layout1);
  
    // create trace for bubble chart
    let trace2 = [{
      x: otu_ids,
      y: bubbleValues,
      text: bubbleLabels,
      mode: "markers",
      marker: {
        size: bubbleValues,
        color: bubbleValues,
        colorscale: "Earth"
      }
    }];

    // create layout for bubble chart
    let layout2 = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      automargin: true,
      hovermode: "closest"
    };

    // use Plotly to plot data
    Plotly.newPlot("bubble", trace2, layout2)

      // create variable that filters metadata array for object with desired sample number
      let metadata = data.metadata;
      let gaugeArray = metadata.filter(metaObj => metaObj.id == sample);

      // create variable to hold first sample
      let gaugeResult = gaugeArray[0];

      // create variable to hold washing frequency
      let wfreqs = gaugeResult.wfreq;
      console.log(wfreqs);

      // create trace for guage chart
      let trace3 = {
        value: wfreqs,
        type: "indicator",
        mode:"gauge+number",
        gauge: {
          axis: {range: [null,10], dtick: "2"},
          bar: {color: "black"},
          steps: [
            {range: [0,2], color: "red"},
            {range: [2,4], color: "orange"},
            {range: [4,6], color: "yellow"},
            {range: [6,8], color: "lightgreen"},
            {range: [8,10], color: "green"},
          ],
          dtick: 2
        }
      };

      // create layout for guage chart
      let layout3 = {
        title: {text: "<b> Belly Button Washing Frequency</b> <br>Scrubs Per Week "},
        automargin: true
      };

      // use Plotly to plot guage chart
      Plotly.newPlot("gauge", [trace3], layout3);
      
    });

  }



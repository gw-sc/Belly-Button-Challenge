// 1. Use the D3 library to read in `samples.json` from the URL `https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json`.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//14.3.09-Dropdown Events
function DropDownFunction() {
    // Use D3 to select the dropdown menu
    var DropDownMenu = d3.select("#selDataset");
    
    // // Assign the value of the dropdown menu option to a variable
    d3.json(url).then((data) => {
        var dataNames = data.names;
        dataNames.forEach((name) => {
            var option = DropDownMenu.append('option');
            option.text(name);
        });
        // demographicInfo(data.names[0]);
        var ID = DropDownMenu.property('value');
        console.log('ID: ', ID);
            demographicInfo(ID);
    });
} 

// 4. Display the sample metadata, i.e., an individual's demographic information.
function demographicInfo(testID) {
    // Use D3 to select the demographic info panel
    var DefaultData = d3.select("#sample-metadata");
        DefaultData.html("");

    d3.json(url).then((data) => {
        var metaData = data.metadata.filter(sample => sample.id == testID)[0];
        console.log("metadata:", metaData);

// 5. Display each key-value pair from the metadata JSON object somewhere on the page.        
        Object.entries(metaData).forEach(([key, value]) => {
            DefaultData.append("h6").text(`${key}: ${value}`);
        });
        var sampleData = data.samples.filter(sample => sample.id == testID)[0];
        Graphs(testID, sampleData);
        // var wfreq = metaData.wfreq;
    });
}

// Graphs
function Graphs(testID, sampleInfo) {
    // Read data from json file for each sample, assign it to a variable, and plot it
    console.log('Test Sample Info: ', sampleInfo);
    console.log("Test Subject ID: ", testID);
    // * Use `sample_values` as the values for the bar chart.
    var sampleValues = sampleInfo.sample_values;
    // * Use `otu_ids` as the labels for the bar chart.
    var otuIDs = sampleInfo.otu_ids;
    // * Use `otu_labels` as the hovertext for the chart.
    var otuLabels = sampleInfo.otu_labels;

// 2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
    var topOtuIDs = otuIDs.slice(0,10).reverse().map(otuID => "OTU ID" + otuID);
    var topOtuLabels = otuLabels.slice(0,10).reverse();
    var topSampleValues = sampleValues.slice(0,10).reverse();
    
    let traceBar = {
        x: topSampleValues,
        y: topOtuIDs,
        text: topOtuLabels,
        type: "bar",
        orientation: "h",
        marker: {
            color: [
                '#FB607F',
                '#F36E8C',
                '#EA7B99',
                '#E289A6',
                '#D997B3',
                '#D1A4C1',
                '#C8B2CE',
                '#C0C0DB',
                '#B7CDE8',
                '#AFDBF5'
            ],
            opacity: 1,
        },
        }
    
    let barData = [traceBar];
    
    let barLayout = {
        title: `Top 10 Bacteria Species in Test ID: ${testID}`,
        xaxis: {title: `Sample Values`},
    }
    Plotly.newPlot("bar", barData, barLayout);

// 3. Create a bubble chart that displays each sample.
    let traceBubble = {
    // * Use `otu_ids` for the x values.
        x: otuIDs,
    // * Use `sample_values` for the y values.
        y: sampleValues,
    // * Use `otu_labels` for the text values.
        text: otuLabels,
        mode: "markers",
        marker: {
        // * Use `sample_values` for the marker size.
            size: sampleValues,
        // * Use `otu_ids` for the marker colors.
            color: otuIDs,
            colorscale: 'Picnic'
        }
    }
    let bubbleData = [traceBubble];

    let bubbleLayout = {
        title: `All Bacteria Species in Test ID: ${testID}`,
        xaxis: {title: `Operational Taxonomic Unit (OTU) ID`},
        yaxis: {title: `Sample Values`}
    }
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
};

// 6. Update all the plots when a new sample is selected. Additionally, you are welcome to create any layout that you would like for your dashboard.
function optionChanged(nextID) {
    console.log("Next Test ID:", nextID)
    demographicInfo(nextID);
}
DropDownFunction();

// 7. Deploy your app to a free static page hosting service, such as GitHub Pages. Submit the links to your deployment and your GitHub repo. Ensure that your repository has regular commits and a thorough README.md file
// View deployed dashboard at https://gw-sc.github.io/belly-button-challenge/

// ## Advanced Challenge Assignment (Optional)
// The following task is advanced and therefore optional.
    // * Adapt the Gauge Chart from <https://plot.ly/javascript/gauge-charts/> to plot the weekly washing frequency of the individual.
    // * You will need to modify the example gauge code to account for values ranging from 0 through 9.
    // * Update the chart whenever a new sample is selected.

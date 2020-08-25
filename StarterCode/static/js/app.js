// d3.json('../data/samples.json').then(function(data) {
// 	console.log(data);
// });

// Option change handler
function optionChanged() {
	// Select the input value from the form
	var id = d3.select('#selDataset').node().value;
	console.log(id);

	// clear the input value after capturing it
	d3.select('#selDataset').node().value = '';

	// Build the plots for the selected ID
	buildPlots(id);
}

//build plots for the selected ID
function buildPlots(id) {
	//read the json file using data promise
	d3.json('data/samples.json').then(function(data) {
		// Grab values from the response json object to build the plots
		data.samples.forEach(function(row) {
			if (row.id === id) {
				console.log(row.id);
				var sampleValue = row.sample_values;
				var otu_id = row.otu_ids;
				var label = row.otu_labels;
				console.log(sampleValue, otu_id, label);

				/******************************************************************************************/
				/*Build Bar plot                                                                          */
				/******************************************************************************************/

				var bar1 = {
					type: 'bar',
					orientation: 'h',
					// Use slice() to Grab the Top 10 sample_values
					x: sampleValue.slice(0, 10),
					y: otu_id.map((id) => String(`OTU ${id}`)),
					text: row.otu_labels,
					transforms: [
						{
							type: 'sort',
							target: 'y',
							order: 'descending'
						}
					]
				};

				var tableData = [ bar1 ];

				var layout = {
					title: `ID ${id} Data`,
					yaxis: {
						autorange: true
					},
					xaxis: {
						autorange: true
					}
				};

				Plotly.newPlot('bar', tableData, layout);
				/******************************************************************************************/
				/*Build Bubble plot                                                                       */
				/******************************************************************************************/
				var bubble1 = {
					type: 'scatter',
					x: otu_id,
					y: sampleValue,
					text: row.otu_labels,
					mode: 'markers',
					marker: {
						size: sampleValue,
						color: otu_id,
						colorscale: [
							[ 0, 'rgb(166,206,227)' ],
							[ 0.25, 'rgb(31,120,180)' ],
							[ 0.45, 'rgb(178,223,138)' ],
							[ 0.65, 'rgb(51,160,44)' ],
							[ 0.85, 'rgb(251,154,153)' ],
							[ 1, 'rgb(227,26,28)' ]
						]
					}
				};

				var bubbleData = [ bubble1 ];

				var layout = {
					title: `ID ${id} Data`,
					showlegend: false,
					yaxis: {
						autorange: true
					},
					xaxis: {
						autorange: true
					},
					height: 600,
					width: 1200
				};

				Plotly.newPlot('bubble', bubbleData, layout);
			} else {
			}
		});

		//build the demographic data
		data.metadata.forEach(function(row) {
			if (row.id === parseInt(id)) {
				console.log(row);
				d3.select('#sample-metadata').html('');
				var sampleData = Object.entries(row);
				sampleData.forEach(function(sample) {
					console.log(sample);
					d3.select('#sample-metadata').append('li').data(sample).text(`${sample[0]}: ${sample[1]}`);
				});
				/******************************************************************************************/
				/*Bonus gauge plot                                                                        */
				/******************************************************************************************/
				let level = parseFloat(row.wfreq) * 20;

				// Trigonometry to Calculate Meter Point
				var degrees = 180 - level,
					radius = 0.5;
				var radians = degrees * Math.PI / 180;
				var aX = 0.025 * Math.cos((degrees - 90) * Math.PI / 180);
				var aY = 0.025 * Math.sin((degrees - 90) * Math.PI / 180);
				var bX = -0.025 * Math.cos((degrees - 90) * Math.PI / 180);
				var bY = -0.025 * Math.sin((degrees - 90) * Math.PI / 180);
				var cX = radius * Math.cos(radians);
				var cY = radius * Math.sin(radians);

				var path = 'M ' + aX + ' ' + aY + ' L ' + bX + ' ' + bY + ' L ' + cX + ' ' + cY + ' Z';
				console.log(path);
				let data = [
					{
						type: 'scatter',
						x: [ 0 ],
						y: [ 0 ],
						marker: { size: 12, color: '850000' },
						showlegend: false,
						text: level,
						hoverinfo: 'text+name'
					},
					{
						values: [ 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 ],
						rotation: 90,
						text: [ '8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', '' ],
						textinfo: 'text',
						textposition: 'inside',
						marker: {
							colors: [
								'rgba(0,105,11,.5)',
								'rgba(10,120,22,.5)',
								'rgba(14,127,0,.5)',
								'rgba(110,154,22,.5)',
								'rgba(170,202,42,.5)',
								'rgba(202,209,95,.5)',
								'rgba(210,206,145,.5)',
								'rgba(232,226,202,.5)',
								'rgba(240, 230,215,.5)',
								'rgba(255,255,255,0)'
							]
						},
						labels: [ '8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', '' ],
						hoverinfo: 'label',
						hole: 0.5,
						type: 'pie',
						showlegend: false
					}
				];

				var layout = {
					shapes: [
						{
							type: 'path',
							path: path,
							fillcolor: '850000',
							line: {
								color: '850000'
							}
						}
					],
					title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
					height: 500,
					width: 500,
					xaxis: {
						zeroline: false,
						showticklabels: false,
						showgrid: false,
						range: [ -1, 1 ]
					},
					yaxis: {
						zeroline: false,
						showticklabels: false,
						showgrid: false,
						range: [ -1, 1 ]
					}
				};
				let GAUGE = document.getElementById('gauge');
				Plotly.newPlot(GAUGE, data, layout);
			}
		});
	});
}

function init() {
	// Grab a Reference to the Dropdown Select Element
	d3.json('data/samples.json').then(function(data) {
		var names = data.names;
		// console.log(names);
		d3
			.selectAll('#selDataset')
			.selectAll('option')
			.select('option')
			.data(names)
			.enter()
			.append('option')
			.attr('value', function(d) {
				return d;
			})
			.text(function(d) {
				return d;
			});
		// Use the First Sample from the List to Build Initial Plots
		const firstSample = names[0];
		optionChanged();
	});

	// Add event listener for submit button
	d3.select('#setDataset').on('click', optionChanged);
}

init();

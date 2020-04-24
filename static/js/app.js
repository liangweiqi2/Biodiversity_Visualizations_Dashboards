function init() {
//1. Use the D3 library to read in samples.json.
     d3.json("./samples.json").then(function(data){
          data=data;
          var metaData=data.metadata
          var id_arr=data.samples
          var selectOption=d3.select("#selDataset")
          id_arr.forEach((obj)=>{
                              selectOption.append("option")
                                        .text(obj.id)
                                        .property("value", obj.id)
                                   })
          var init_id=id_arr[0].otu_ids.slice(0,10);
          var init_id_1=init_id.map(d=>`OTU${d}`)
          var init_value=id_arr[0].sample_values.slice(0,10);
          var init_text=id_arr[0].otu_labels.slice(0,10)
          function init_graph(){
               
               var in_trace = [{
                    x: init_value,
                    y: init_id_1,
                    text: init_text,
                    type: "bar",
                    orientation: 'h'
               }];
               var layout_in = {
                    title: "Sample_ID 940",
                    yaxis: {
                         autorange: "reversed"
                       }
               };
               Plotly.newPlot("bar", in_trace, layout_in);
               Plotly.d3.json('https://raw.githubusercontent.com/plotly/datasets/master/custom_heatmap_colorscale.json', function(figure) {
               var in_trace2 = [{
                    // Use otu_ids for the x values.
                    x: init_id,
                    // Use sample_values for the y values.
                    y: init_value,
                    // Use otu_labels for the text values.
                    text: init_text,
                    mode: 'markers',
                    // Use sample_values for the marker size.
                    // Use otu_ids for the marker colors.
                    marker: {
                    size:init_value,
                    // color:init_id_1,
                    color:['rgb(204, 255, 102)','rgb(179, 255, 102)','rgb(140, 255, 102)','rgb(102, 255, 102)','rgb(102, 255, 140)','rgb(102, 255, 179)','rgb(102, 255, 217)','rgb(217, 255, 102)', 'rgb(255, 255, 102)','	rgb(102, 255, 255)']
                    // colorscale:"Electric",
                    // type: 'heatmap'

               }
               }];
               var layout_in2 = {
                    title:{text:`Sample_940`},
                    xaxis:{title:{ text:`OTU ID`}}
                   
                    };
               Plotly.newPlot('bubble', in_trace2, layout_in2);})
          }
          init_graph() 
          function init_Meta(){
               var displayBox=d3.select("#sample-metadata")
               var table=displayBox.html("").append("table")
               var thead=table.append('thead')
               var head_row=thead.append('tr')
               head_row.append("th").text("Identifier_")
               head_row.append("th").text("Value")
               var tbody=table.append("tbody")
               Object.entries(metaData[0]).forEach(([key,value])=>{
                         (key,value);
               var row=tbody.append("tr");
               row.append("td").text(key);
               // console.log(key);
               row.append("td").text(value);
               // console.log(value)
               }) 
          }
          init_Meta()
     })
}
init();

//6. Update all of the plots any time that a new sample is selected.
function optionChanged(){
     var selectValue=d3.select("#selDataset").property("value")
     console.log(selectValue)
     displayMetadata(selectValue)
     updateGraph(selectValue)
}
d3.select("selDataset").on("change", optionChanged)
//2a.Display the sample metadata, i.e., an individual's demographic information.
//2b.Display each key-value pair from the metadata JSON object somewhere on the page.
function displayMetadata(selectValue){
     d3.json("./samples.json").then(function(data){
          data=data;
          var metaData=data.metadata
          var displayBox=d3.select("#sample-metadata")
          var table=displayBox.html("").append("table")
          var thead=table.append('thead')
          var head_row=thead.append('tr')
          head_row.append("th").text("Identifier_")
          head_row.append("th").text("Value")
          var tbody=table.append("tbody")
          var selectValue=d3.select("#selDataset").property("value")
          var Selectvalue=metaData.filter(d=>d.id==selectValue)
          Object.entries(Selectvalue[0]).forEach(([key,value])=>{
                    console.log(`${key}: ${value}`)
                    var row=tbody.append("tr")
                    row.append("td").text(key)
                    row.append("td").text(value)
          })
     })
}

//3. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
function updateGraph(selectValue){
     d3.json("./samples.json").then(function(data){
          data=data;
          var id_arr=data.samples
          var Selectvalue=id_arr.filter(d=>d.id==selectValue)
          var subjectID=Selectvalue[0].id
          console.log(subjectID)
          var selected=Selectvalue[0].otu_ids.slice(0,10)
          // var otu_ids_arr=selected.map(d=>d.otu_ids.slice(0,10))
          // Use otu_ids as the labels for the bar chart.
          var otu_ids=selected.map(d=>`OTU ${d}`)
          // Use sample_values as the values for the bar chart.
          var sample_values=Selectvalue[0].sample_values.slice(0,10)
          // Use otu_labels as the hovertext for the chart.
          var otu_labels=Selectvalue[0].otu_labels.slice(0,10)
          console.log(otu_ids)
          console.log(sample_values)
          console.log(otu_labels) 
          var trace=[{
               x:sample_values,
               y:otu_ids,
               text: otu_labels,
               type: "bar",
               orientation: 'h',
               }]
          var layout1={
               title: `Sample_ID ${subjectID}`,
               yaxis: {
                    autorange: "reversed"
               }
          }
          Plotly.newPlot("bar",trace,layout1)
          //4. Create a bubble chart that displays each sample.     
          var trace2 = [{
               // Use otu_ids for the x values.
               x: selected,
               // Use sample_values for the y values.
               y: sample_values,
               // Use otu_labels for the text values.
               text: otu_labels,
               mode: 'markers',
               // Use sample_values for the marker size.
               // Use otu_ids for the marker colors.
               marker: {
               size:sample_values,
               // color:otu_ids
               color:['rgb(204, 255, 102)','rgb(179, 255, 102)','rgb(140, 255, 102)','rgb(102, 255, 102)','rgb(102, 255, 140)','rgb(102, 255, 179)','rgb(102, 255, 217)','rgb(217, 255, 102)', 'rgb(255, 255, 102)','	rgb(102, 255, 255)']
               // colorscale:"Electric",
               // type: 'heatmap'
          }
          }];
          var layout2 = {
               
               title:{text:`Sample_ID ${subjectID}`},
               xaxis:{title:{ text:`OTU ID`}}
               };
          Plotly.newPlot('bubble', trace2, layout2);
        
})
} 
          
     



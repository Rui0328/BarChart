let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest();

let data;
let values;

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select("svg");

let drawCanvas =()=>{
    svg.attr("width", width)
    svg.attr("height", height)
}

let generateScales =()=>{ //scaleは目盛りのこと.画面表示用の準備
   heightScale = d3.scaleLinear() 
                    .domain([0,d3.max(values,(item)=>{return item[1]})]) //配列で、一番低いvalueと一番高いvalueがくる
                    .range([0,height - (2*padding)])//視覚的な幅を指定
   xScale = d3.scaleLinear()  
                    .domain([0,values.length - 1]) 
                    .range([padding, width - padding])   
   let datesArray = values.map((item)=>{
    return new Date(item[0]); //時間にconvertする
   }) 

   xAxisScale = d3.scaleTime()
                  .domain([d3.min(datesArray), d3.max(datesArray)]) 
                  .range([padding, width-padding])
                
   yAxisScale = d3.scaleLinear()
                  .domain([0, d3.max(values, (item)=>{return item[1]})])     
                  .range([height - padding, padding])   //  Do not forget []!!!      
}  

let drawBars=()=>{
     
    let tooltip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("visibility", "hidden")
                    .style("width", "auto")
                    .style("height", "auto")

    svg.selectAll("rect") //ここでは画面の表示ではなく、HTML要素を作っている
       .data(values)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("width",(width - (2+ padding))/ values.length)
       .attr("data-date",(item)=>{
           return item[0]
       } )
       .attr("data-gdp", (item)=>{
           return item[1]
       })
       .attr("height", (item)=>{
        return heightScale(item[1])
       })
       .attr("x", (item,index)=>{
          return xScale(index)
       })
       .attr('y', (item)=>{
         return (height - padding) - heightScale(item[1])
       })
       .on("mouseover", (item)=>{
         tooltip.transition()
                 .style("visibility", "visible")

         tooltip.text(item[0])

         document.getElementById("tooltip").setAttribute("data-date", item[0])
       })
       .on("mouseout", (item)=>{
        tooltip.transition()
        .style("visibility", "hidden")
       })



}

let generateAxis=()=>{ //実際に画面に表示させる
    let xAxis = d3.axisBottom(xAxisScale);
    let yAxis = d3.axisLeft(yAxisScale);

    svg.append("g")
       .call(xAxis) //gのなかに、xAxisをappendしている
       .attr("id", "x-axis") //上のにidをつけている
       .attr("transform", 'translate(0,'+(height-padding)+')') //x, y軸が（）の中.これは、x軸が上に出てしまっていたのを下にするため

       svg.append("g")
       .call(yAxis)
       .attr("id", "y-axis") 
       .attr("transform", 'translate('+padding + ',0)') 
    


}

req.open("GET",url, true);
req.onload = ()=>{
    data = JSON.parse(req.responseText); 
    values = data.data;
    console.log(values);
    drawCanvas();
    generateScales();
    generateAxis();
    drawBars();
    
}

req.send();
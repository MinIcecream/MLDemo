const constants=require("../common/constants.js");
const KNN=require("../common/classifiers/knn.js"); 
const fs=require("fs");
const Chart = require("chart.js/auto");

const {samples:trainingSamples}=JSON.parse(
    fs.readFileSync(constants.TRAINING)
); 

const {samples:testingSamples}=JSON.parse(
    fs.readFileSync(constants.TESTING)
);

let results=[];
const totalCount=testingSamples.length;
for(let i=1;i<200;i++){   
    kNN=new KNN(trainingSamples,i);
    let correctCount=0;
    for(const sample of testingSamples){
        const {label:predictedLabel}=kNN.predict(sample.point);
        correctCount+=predictedLabel==sample.label; 
    } 
    console.log("k="+i+" ACCURACY: "+
        correctCount+"/"+totalCount+" ("+
        utils.formatPercent(correctCount/totalCount)+
        ")"
    );
    results.push(correctCount/totalCount); 
} 

// Data and options for the chart (same as before) 
const {createCanvas}=require("canvas");
const canvas=createCanvas(500,500);
const ctx=canvas.getContext("2d");  

let labelsArr=[];
let dataset=[];
for(let i=1;i<200;i++){
  labelsArr.push(i);
  dataset.push(results[i-1]);
}
new Chart(ctx, {
  type: 'line',
  data: {
    labels: labelsArr,
    datasets: [{
      label: '% correct',
      data: dataset,
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
   
const buffer=canvas.toBuffer("image/png");
fs.writeFileSync(constants.CHART,buffer);
 
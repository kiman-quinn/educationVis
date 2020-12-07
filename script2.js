d3.csv('nepalData.csv', d3.autoType)
    .then(data=>{
        nepal = data
        console.log(nepal);
    })
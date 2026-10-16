const potrace=require('potrace');const fs=require('fs');
const [,,inp,out]=process.argv;
potrace.trace(inp,{turdSize:6,optTolerance:0.25,alphaMax:0.9,threshold:128,color:'#000'},(e,svg)=>{if(e)throw e;fs.writeFileSync(out,svg);console.log(out,svg.length)});

import { useSelector } from "react-redux";
import "../styles/style.css";
import Navbar from "../components/Navbar";
import {  useRef, useState} from 'react';
import { jsPDF } from 'jspdf';
import axios from "axios"
import { URL } from "../url";
// import svgToImg from 'svg-to-img';


const Vectorimagecomponent = () => {
  const svgRef = useRef(null);
  const svgRefFront = useRef(null);
  const svgRefFront2 = useRef(null);

  const frontviewpoints = useSelector((state) => state.trouser.frontviewpoints);
  // const calculatedPointsPixels= useSelector((state) => state.trouser.calculatedPointsPixels)
  const [imageDataUrlJPEG, setImageDataUrlJPEG] = useState(null);
  const [imageDataUrlJPEG2, setImageDataUrlJPEG2] = useState(null);

  // const [svgurl, setSVGURL]= useState("");



const uploadPDFToBackend = async (pdfFile) => {
  try {
    // Create FormData object
    const formData = new FormData();
    formData.append('pdf', pdfFile, 'tailor_info.pdf');

    // Send PDF file to backend using Axios
    const response = await axios.post(URL+'/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('PDF uploaded successfully:', response.data);
  } catch (error) {
    console.error('Error uploading PDF:', error);
  }
};



  const handleDownloadimage = () => {
    const svg = svgRef.current;

    // Get the width and height of the SVG
    const svgWidth = svg.width.baseVal.value;
    const svgHeight = svg.height.baseVal.value;

    // Create the first canvas for the first half of the SVG
    const canvas1 = document.createElement('canvas');
    const ctx1 = canvas1.getContext('2d');
    canvas1.width = svgWidth / 2;
    canvas1.height = svgHeight;

    // Draw first half of SVG onto canvas1
    const svgData = new XMLSerializer().serializeToString(svg);
    const img1 = new Image();
    img1.onload = () => {
      ctx1.drawImage(img1, 0, 0, canvas1.width, canvas1.height, 0, 0, canvas1.width, canvas1.height);

      // Convert canvas1 to data URL
      const dataUrl1 = canvas1.toDataURL('image/png');

      // Trigger download for first half
      const link1 = document.createElement('a');
      link1.download = 'image_part1.png';
      link1.href = dataUrl1;
      link1.click();
    };
    img1.src = 'data:image/svg+xml;base64,' + btoa(svgData);

    // Create the second canvas for the second half of the SVG
    const canvas2 = document.createElement('canvas');
    const ctx2 = canvas2.getContext('2d');
    canvas2.width = svgWidth / 2;
    canvas2.height = svgHeight;

    // Draw second half of SVG onto canvas2
    const img2 = new Image();
    img2.onload = () => {
      ctx2.drawImage(img2, svgWidth / 2, 0, canvas2.width, canvas2.height, 0, 0, canvas2.width, canvas2.height);

      // Convert canvas2 to data URL
      const dataUrl2 = canvas2.toDataURL('image/png');

      // Trigger download for second half
      const link2 = document.createElement('a');
      link2.download = 'image_part2.png';
      link2.href = dataUrl2;
      link2.click();
    };
    img2.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };




  

const downloadPDF = async () => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'cm',
      format: [23,30]
    });


    // Define common styles
    const commonStyle = {
      font: "helvetica",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 10, // Increase font size for better readability
      lineHeight: 1.5,
      textColor: "#000000",
      borderColor: "#000000",
      borderWidth: 0.07
    };

    // Add border for the entire document with 3cm margin on all sides
    const margin = 2;
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();
    doc.setDrawColor(commonStyle.borderColor);
    doc.setLineWidth(commonStyle.borderWidth);
    doc.rect(margin, margin, pdfWidth - 2 * margin, pdfHeight - 2 * margin, "S");

    // Add heading with cursive font and pink color
    const headingStyle = {
      font: "times",
      fontStyle: "italic",
      fontSize: 16, // Increase font size for heading
      textColor: "#ff69b4"
    };
    doc.setFont(headingStyle.font, headingStyle.fontStyle);
    doc.setFontSize(headingStyle.fontSize);
    doc.setTextColor(headingStyle.textColor);
    doc.text("Tomorrow's Tailor ", margin + 2, margin + 2); // Adjust position as needed

    // Add information about tomorrow's tailor
    doc.setFont(commonStyle.font, commonStyle.fontStyle, commonStyle.fontWeight);
    doc.setFontSize(16); // Increase font size for information
    doc.setTextColor(commonStyle.textColor);
    doc.text("Information about user customised values", margin + 1, margin + 4); // Adjust position as needed

    // Add customised values with borders and styling
    let yPos = margin + 6; // Adjust starting position
    const labels = ["Waist", "Hip", "Waist to Hip", "Body Rise", "Waist to Floor", "Trouser Bottom Width"];
    const keys = ["A", "B", "C", "D", "E", "F"];
    const cellWidth = 8;
    const cellHeight = 2;

    labels.forEach((label, index) => {
      // Draw border for each cell
      doc.setDrawColor(commonStyle.borderColor);
      doc.setLineWidth(commonStyle.borderWidth);
      doc.rect(margin + 1, yPos + index * cellHeight, cellWidth, cellHeight, "D");

      // Draw label
      doc.setFont(commonStyle.font, commonStyle.fontStyle, commonStyle.fontWeight);
      doc.setFontSize(commonStyle.fontSize);
      doc.setTextColor(commonStyle.textColor);
      doc.text(label, margin + 1.3, yPos + index * cellHeight + 1); // Adjust position as needed

      // Draw customised value
      doc.setFont(commonStyle.font, "normal", commonStyle.fontWeight);
      doc.text(customisedvalues[keys[index]], margin + 9, yPos + index * cellHeight + 1); // Adjust position as needed
    });

    doc.addPage();
    doc.text("Print Actual Size (100% Scale);", margin-1, margin-1)
    doc.text("Front-view of Trouser", margin-1, margin-2)

    const svg = svgRefFront.current;
    const imageDataUrl = await getSvgImage(svg);
    setImageDataUrlJPEG(imageDataUrl);
    doc.addImage(imageDataUrlJPEG, 'JPEG', margin+3, margin, pdfWidth - 1 * margin, pdfHeight-1 * margin-1, null, 'FAST');
    doc.addPage();
    doc.text("Print Actual Size (100% Scale);", margin-1, margin-1)
    doc.text("Back-view of Trouser", margin-1, margin-2)
    const svg2 = svgRefFront2.current;
    const imageDataUrl2 = await getSvgImage(svg2);
    setImageDataUrlJPEG2(imageDataUrl2);
    doc.addImage(imageDataUrlJPEG2, 'JPEG', margin+2, margin, pdfWidth - 1 * margin, pdfHeight-1 * margin-1, null, 'FAST');
    doc.save("tailor_info.pdf");
    uploadPDFToBackend(doc.output('blob'));

  } catch (error) {
    console.error('Error converting SVG to PDF:', error);
  }
};



const getSvgImage = (svg) => {
  return new Promise((resolve, reject) => {
    try {
      const svgString = new XMLSerializer().serializeToString(svg);

      // Calculate SVG dimensions in centimeters
      const svgWidthCM = (svg.width.baseVal.value)*2; // Assuming 96 DPI
      const svgHeightCM = (svg.height.baseVal.value)*2; //;

      console.log(svg.width.baseVal.value, svg.height.baseVal.value, svgWidthCM, svgHeightCM);

      const a4WidthCM = 23; // A4 width in centimeters
      const a4HeightCM = 30; // A4 height in centimeters
      const svgWithBackground = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidthCM}" height="${svgHeightCM}" viewBox="0 0 ${svg.width.baseVal.value} ${svg.height.baseVal.value}" style="background-color: #ffffff" transform="scale(1, -1)">${svgString}</svg>`;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = a4WidthCM * 96 / 2.54; // A4 width in pixels (assuming 96 DPI)
        canvas.height = a4HeightCM * 96 / 2.54; // A4 height in pixels
        console.log(canvas.width,canvas.height)
        context.drawImage(img, 0, 0, svgWidthCM, svgHeightCM);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgWithBackground);
    } catch (error) {
      reject(error);
    }
  });
};






  const pairs = [
    [10, 6],
    [6,9],
    [9, 15],
    [15, 14],
    [14, 3],
    [3, 12],
    [12, 13],
    [13, 8],
    [8, 11],
    [11, 10],
    [30,30],
    [32,32],
    [33,33],
    [6,6],
    [8,8],
  ];
  const backpairs=[[21,22],[22,25],[25,27],[27,26],[26,28],[28,29],[24,29],[19,24],[19,21],[31,31],[34,34],[35,35],[36,36],[37,37]]
  const gridpairs=[[7,18],[18,17],[18,0],[0,22],[0,2],[2,25],[2,17],[17,6],[6,7],[17,16],[16,1],[1,2],[16,5],[5,23],[23,24],[24,29],[29,15],[15,4],[5,15],[4,1],[4,27],[4,3],[3,26],[3,28]]
  const calculatedPoints = useSelector(
    (state) => state.trouser.calculatedPoints
  );
  const objlenForVector = useSelector((state) => state.trouser.objlenForVector);
  const backviewpoints = useSelector((state) => state.trouser.backviewpoints);
  const gridviewpoints = useSelector((state) => state.trouser.gridviewpoints);
  const customisedvalues= useSelector((state) => state.trouser.customiseduservalues);
  
  console.log("Calculated Points:", calculatedPoints);
  console.log("Object Length for Vector:", objlenForVector);
  console.log("front view points:", frontviewpoints)
  console.log("user values", customisedvalues)


  const generateFrontview = () => {
    const lines = [];
    for (let i = 0; i < pairs.length; i++) {
      const [u, v] = pairs[i];
      const point1 = frontviewpoints[u];
      const point2 = frontviewpoints[v];

      if (u===6 && v===9) {
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1} ${y1} A9 6, 0, 0 0, ${x2} ${y2}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none" strokeDasharray="4,1"/> 
        );
      }else if(u===8 && v===11){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1} ${y1} A24 48, 0, 0 1, ${x2} ${y2}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none" strokeDasharray="4,1"/> 
        );
      }else if(u===9 && v===15){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1} ${y1} A60 55, 0, 0 0, ${x2} ${y2}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none" strokeDasharray="4,1"/> 
        );
      }else if(u===30 && v===30){
        const { x: x1, y: y1 } = point1;


        const pointStyle = {
          fill: 'darkred', 
        };
        lines.push(
              <circle cx={x1} cy={y1} r={0.6} style={pointStyle}/>
        )
      }else if(u===32 && v===32){
        const { x: x1, y: y1 } = point1;


        const pointStyle = {
          fill: 'darkred', 
        };
        lines.push(
              <circle cx={x1} cy={y1} r={0.6} style={pointStyle}/>
        )
      }else if(u===33 && v===33){
        const { x: x1, y: y1 } = point1;


        const pointStyle = {
          fill: 'darkred', 
        };
        lines.push(
              <circle cx={x1} cy={y1} r={0.6} style={pointStyle}/>
        )
      }
      else{
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        lines.push(
            <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="black"
            strokeWidth="0.503"
            fill="none"
            strokeDasharray="4,1"
          />
          );
      }
    }
    return lines;
  };


  const generateFront1view = () => {
    const lines = [];
    for (let i = 0; i < pairs.length; i++) {
      const [u, v] = pairs[i];
      const point1 = frontviewpoints[u];
      const point2 = frontviewpoints[v];

      if (u===6 && v===9) {
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1} ${y1+110} A9 6, 0, 0 0, ${x2} ${y2+110}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.503" fill="none"/> 
        );
      }else if(u===8 && v===11){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1} ${y1+110} A24 48, 0, 0 1, ${x2} ${y2+110}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none"/> 
        );
      }else if(u===6 && v===6){
        const { x: x1, y: y1 } = point1;


        const pointStyle = {
          fill: 'yellow', 
        };
        lines.push(
              <circle cx={x1} cy={y1+110} r={0.6} style={pointStyle}/>
        )
      
      }else if(u===8 && v===8){
        const { x: x1, y: y1 } = point1;


        const pointStyle = {
          fill: 'yellow', 
        };
        lines.push(
              <circle cx={x1} cy={y1+110} r={0.6} style={pointStyle}/>
        )
      
      }
      else if(u===9 && v===15){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1} ${y1+110} A60 55, 0, 0 0, ${x2} ${y2+110}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none"/> 
        );
      }else if(u===30 && v===30){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        console.log(x2, y2);
        // const size = 1.5;

        const pointStyle = {
          fill: 'darkred', 
        };
        lines.push(
              <circle cx={x1} cy={y1+110} r={0.6} style={pointStyle}/>
        )
      }else if(u===32 && v===32){
        const { x: x1, y: y1 } = point1;


        const pointStyle = {
          fill: 'darkred', 
        };
        lines.push(
              <circle cx={x1} cy={y1+110} r={0.6} style={pointStyle}/>
        )
      }else if(u===33 && v===33){
        const { x: x1, y: y1 } = point1;


        const pointStyle = {
          fill: 'darkred', 
        };
        lines.push(
              <circle cx={x1} cy={y1+110} r={0.6} style={pointStyle}/>
        )
      }
      else{

        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        lines.push(
            <line
            x1={x1}
            y1={y1+110}
            x2={x2}
            y2={y2+110}
            stroke="black"
            strokeWidth="0.503"
          />
          );
      }

    }
    return lines;
  };

  const generateBackview = () => {
    const lines = [];
    for (let i = 0; i < backpairs.length; i++) {
      const [u, v] = backpairs[i];
      const point1 = backviewpoints[u];
      const point2 = backviewpoints[v];
      if (u===19 && v===24) {
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1} ${y1} A9 16, 0, 0 0, ${x2} ${y2}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none"/> 
        );
      }else if(u===24 && v===29){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1} ${y1} A50 125, 0, 0 0, ${x2} ${y2}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none" /> 
        );
      }else if(u===22 && v===25){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1} ${y1} A65 80 , 0, 0 0, ${x2} ${y2}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none" /> 
        );
      }else if(u===25 && v===27){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1} ${y1} A55 145 , 0, 0 1, ${x2} ${y2}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none" /> 
        );
      }else if(u===26 && v===28){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1} ${y1} A10 1 , 0, 0 0, ${x2} ${y2}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none" /> 
        );
      }else if(u===31 && v===31){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        console.log(x2, y2);
        // const size = 1.5;

        const pointStyle = {
          fill: 'blue', 
        };
        lines.push(
              <circle cx={x1} cy={y1} r={0.6} style={pointStyle}/>
        )
      }else if(u===34 && v===34){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        console.log(x2, y2);
        // const size = 1.5;

        const pointStyle = {
          fill: 'blue', 
        };
        lines.push(
              <circle cx={x1} cy={y1} r={0.6} style={pointStyle}/>
        )
      }else if(u===35 && v===35){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        console.log(x2, y2);
        // const size = 1.5;

        const pointStyle = {
          fill: 'blue', 
        };
        lines.push(
              <circle cx={x1} cy={y1} r={0.6} style={pointStyle}/>
        )
      }else if(u===36 && v===36){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        console.log(x2, y2);
        // const size = 1.5;

        const pointStyle = {
          fill: 'blue', 
        };
        lines.push(
              <circle cx={x1} cy={y1} r={0.6} style={pointStyle}/>
        )
      }else if(u===37 && v===37){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        console.log(x2, y2);
        // const size = 1.5;

        const pointStyle = {
          fill: 'blue', 
        };
        lines.push(
              <circle cx={x1} cy={y1} r={0.6} style={pointStyle}/>
        )
      }
      else{
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        lines.push(
            <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="black"
            strokeWidth="0.503"
            fill="none"
          />
          );
      }
    }
    return lines;
  };

  const generateBack1view = () => {
    const lines = [];
    for (let i = 0; i < backpairs.length; i++) {
      const [u, v] = backpairs[i];
      const point1 = backviewpoints[u];
      const point2 = backviewpoints[v];
      if (u===19 && v===24) {
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1+55} ${y1+110} A9 16, 0, 0 0, ${x2+55} ${y2+110}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none"/> 
        );
      }else if(u===24 && v===29){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1+55} ${y1+110} A50 125, 0, 0 0, ${x2+55} ${y2+110}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none" /> 
        );
      }else if(u===22 && v===25){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1+55} ${y1+110} A65 80 , 0, 0 0, ${x2+55} ${y2+110}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none" /> 
        );
      }else if(u===25 && v===27){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1+55} ${y1+110} A55 145 , 0, 0 1, ${x2+55} ${y2+110}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none" /> 
        );
      }else if(u===26 && v===28){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1+55} ${y1+110} A10 1 , 0, 0 0, ${x2+55} ${y2+110}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none" /> 
        );
      }else if(u===31 && v===31){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        console.log(x2, y2);
        // const size = 1.5;

        const pointStyle = {
          fill: 'blue', 
        };
        lines.push(
              <circle cx={x1+55} cy={y1+110} r={0.6} style={pointStyle}/>
        )
      }else if(u===34 && v===34){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        console.log(x2, y2);
        // const size = 1.5;

        const pointStyle = {
          fill: 'blue', 
        };
        lines.push(
              <circle cx={x1+55} cy={y1+110} r={0.6} style={pointStyle}/>
        )
      }else if(u===35 && v===35){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        console.log(x2, y2);
        // const size = 1.5;

        const pointStyle = {
          fill: 'blue', 
        };
        lines.push(
              <circle cx={x1+55} cy={y1+110} r={0.6} style={pointStyle}/>
        )
      }else if(u===36 && v===36){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        console.log(x2, y2);
        // const size = 1.5;

        const pointStyle = {
          fill: 'blue', 
        };
        lines.push(
              <circle cx={x1+55} cy={y1+110} r={0.6} style={pointStyle}/>
        )
      }else if(u===37 && v===37){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        console.log(x2, y2);
        // const size = 1.5;

        const pointStyle = {
          fill: 'blue', 
        };
        lines.push(
          <circle cx={x1+55} cy={y1+110} r={0.6} style={pointStyle}/>
        )
      }
      else{
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        lines.push(
            <line
            x1={x1+55}
            y1={y1+110}
            x2={x2+55}
            y2={y2+110}
            stroke="black"
            strokeWidth="0.503"
            fill="none"
          />
          );
      }
    }
    return lines;
  };
  const generateBack2view = () => {
    const lines = [];
    for (let i = 0; i < backpairs.length; i++) {
      const [u, v] = backpairs[i];
      const point1 = backviewpoints[u];
      const point2 = backviewpoints[v];
      if (u===19 && v===24) {
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1} ${y1+110} A9 16, 0, 0 0, ${x2} ${y2+110}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none"/> 
        );
      }else if(u===24 && v===29){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1} ${y1+110} A50 125, 0, 0 0, ${x2} ${y2+110}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none" /> 
        );
      }else if(u===22 && v===25){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1} ${y1+110} A65 80 , 0, 0 0, ${x2} ${y2+110}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none" /> 
        );
      }else if(u===25 && v===27){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1} ${y1+110} A55 145 , 0, 0 1, ${x2} ${y2+110}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none" /> 
        );
      }else if(u===26 && v===28){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        const d = `M${x1} ${y1+110} A10 1 , 0, 0 0, ${x2} ${y2+110}`;
        lines.push(
          <path d={d} stroke="Black" strokeWidth="0.505" fill="none" /> 
        );
      }else if(u===31 && v===31){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        console.log(x2, y2);
        // const size = 1.5;

        const pointStyle = {
          fill: 'blue', 
        };
        lines.push(
              <circle cx={x1} cy={y1+110} r={0.6} style={pointStyle}/>
        )
      }else if(u===34 && v===34){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        console.log(x2, y2);
        // const size = 1.5;

        const pointStyle = {
          fill: 'blue', 
        };
        lines.push(
              <circle cx={x1} cy={y1+110} r={0.6} style={pointStyle}/>
        )
      }else if(u===35 && v===35){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        console.log(x2, y2);
        // const size = 1.5;

        const pointStyle = {
          fill: 'blue', 
        };
        lines.push(
              <circle cx={x1} cy={y1+110} r={0.6} style={pointStyle}/>
        )
      }else if(u===36 && v===36){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        console.log(x2, y2);
        // const size = 1.5;

        const pointStyle = {
          fill: 'blue', 
        };
        lines.push(
              <circle cx={x1} cy={y1+110} r={0.6} style={pointStyle}/>
        )
      }else if(u===37 && v===37){
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        console.log(x2, y2);
        // const size = 1.5;

        const pointStyle = {
          fill: 'blue', 
        };
        lines.push(
          <circle cx={x1} cy={y1+110} r={0.6} style={pointStyle}/>
        )
      }
      else{
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        lines.push(
            <line
            x1={x1}
            y1={y1+110}
            x2={x2}
            y2={y2+110}
            stroke="black"
            strokeWidth="0.503"
            fill="none"
          />
          );
      }
    }
    return lines;
  };
  const generateGridview = () => {
    const lines = [];
    for (let i = 0; i < gridpairs.length; i++) {
      const [u, v] = gridpairs[i];
      const point1 = gridviewpoints[u];
      const point2 = gridviewpoints[v];
      const { x: x1, y: y1 } = point1;
      const { x: x2, y: y2 } = point2;


      const d = `M${x1+125} ${y1+110} C${x1+125} ${(y1+110 + y2+110) / 2}, ${x2+125} ${(y1+110 + y2+110) / 2}, ${x2+125} ${y2+110}`;
      lines.push(
      <path d={d} stroke="Black" strokeWidth="0.503" fill="none"/>

      );
    }
    return lines;
  };


return (
  <>
  <Navbar/>
    <div className="gridbox ">
      <div className="svg-container">
        <svg ref={svgRef} width="800" height="1000" viewBox="-0 -115 130 240.0034" baseProfile="full" xmlns="http://www.w3.org/2000/svg" transform="scale(1, -1)" style={{backgroundColor:"whitesmoke" ,borderRadius:"5rem", marginTop:"100px"}}>
         {generateGridview()}
         {generateBackview()}
         {generateFront1view()}
         {generateBack1view()}
         {generateFrontview()}
          <g fill="none" stroke="Black">
          {/* vertical lines */}
            <polyline shapeRendering="crispEdges" points="-1.3632, -110.0803 -1.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-2.3632, -110.0803 -2.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-3.3632, -110.0803 -3.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-4.3632, -110.0803 -4.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-5.3632, -110.0803 -5.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-6.3632, -110.0803 -6.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-7.3632, -110.0803 -7.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-8.3632, -110.0803 -8.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-9.3632, -110.0803 -9.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-10.3632, -110.0803 -10.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-11.3632, -110.0803 -11.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-12.3632, -110.0803 -12.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-13.3632, -110.0803 -13.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-14.3632, -110.0803 -14.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-15.3632, -110.0803 -15.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-16.3632, -110.0803 -16.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-17.3632, -110.0803 -17.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-18.3632, -110.0803 -18.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-19.3632, -110.0803 -19.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-20.3632, -110.0803 -20.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-21.3632, -110.0803 -21.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-22.3632, -110.0803 -22.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-23.3632, -110.0803 -23.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-24.3632, -110.0803 -24.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-25.3632, -110.0803 -25.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-26.3632, -110.0803 -26.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-27.3632, -110.0803 -27.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-28.3632, -110.0803 -28.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-29.3632, -110.0803 -29.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-30.3632, -110.0803 -30.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-31.3632, -110.0803 -31.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-32.3632, -110.0803 -32.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-33.3632, -110.0803 -33.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-34.3632, -110.0803 -34.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-35.3632, -110.0803 -35.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-36.3632, -110.0803 -36.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-37.3632, -110.0803 -37.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-38.3632, -110.0803 -38.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-39.3632, -110.0803 -39.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>


            <polyline shapeRendering="crispEdges" points="-0.3632, -110.0803 -0.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="0.3632, -110.0803 0.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>

            <polyline shapeRendering="crispEdges" points="1.3632, -110.0803 1.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="2.3632, -110.0803 2.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="3.3632, -110.0803 3.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="4.3632, -110.0803 4.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="5.3632, -110.0803 5.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="6.3632, -110.0803 6.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="7.3632, -110.0803 7.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="8.3632, -110.0803 8.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="9.3632, -110.0803 9.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="10.3632, -110.0803 10.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="11.3632, -110.0803 11.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="12.3632, -110.0803 12.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="13.3632, -110.0803 13.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="14.3632, -110.0803 14.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="15.3632, -110.0803 15.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="16.3632, -110.0803 16.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="17.3632, -110.0803 17.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="18.3632, -110.0803 18.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="19.3632, -110.0803 19.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="20.3632, -110.0803 20.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="21.3632, -110.0803 21.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="22.3632, -110.0803 22.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="23.3632, -110.0803 23.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="24.3632, -110.0803 24.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="25.3632, -110.0803 25.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="26.3632, -110.0803 26.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="27.3632, -110.0803 27.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="28.3632, -110.0803 28.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="29.3632, -110.0803 29.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="30.3632, -110.0803 30.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="31.3632, -110.0803 31.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="32.3632, -110.0803 32.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="33.3632, -110.0803 33.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="34.3632, -110.0803 34.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="35.3632, -110.0803 35.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="36.3632, -110.0803 36.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="37.3632, -110.0803 37.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="38.3632, -110.0803 38.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="39.3632, -110.0803 39.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="40.3632, -110.0803 40.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="41.3632, -110.0803 41.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="42.3632, -110.0803 42.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="43.3632, -110.0803 43.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="44.3632, -110.0803 44.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="45.3632, -110.0803 45.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="46.3632, -110.0803 46.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="47.3632, -110.0803 47.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="48.3632, -110.0803 48.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="49.3632, -110.0803 49.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="50.3632, -110.0803 50.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="51.3632, -110.0803 51.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="52.3632, -110.0803 52.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="53.3632, -110.0803 53.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="54.3632, -110.0803 54.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="55.3632, -110.0803 55.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="56.3632, -110.0803 56.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="57.3632, -110.0803 57.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="58.3632, -110.0803 58.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="59.3632, -110.0803 59.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="60.3632, -110.0803 60.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="61.3632, -110.0803 61.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="62.3632, -110.0803 62.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="63.3632, -110.0803 63.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="64.3632, -110.0803 64.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="65.3632, -110.0803 65.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="66.3632, -110.0803 66.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="67.3632, -110.0803 67.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="68.3632, -110.0803 68.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="69.3632, -110.0803 69.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="70.3632, -110.0803 70.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="71.3632, -110.0803 71.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="72.3632, -110.0803 72.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="73.3632, -110.0803 73.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="74.3632, -110.0803 74.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="75.3632, -110.0803 75.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="76.3632, -110.0803 76.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="77.3632, -110.0803 77.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="78.3632, -110.0803 78.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="79.3632, -110.0803 79.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="80.3632, -110.0803 80.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="81.3632, -110.0803 81.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="82.3632, -110.0803 82.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="83.3632, -110.0803 83.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="84.3632, -110.0803 84.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="85.3632, -110.0803 85.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="86.3632, -110.0803 86.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="87.3632, -110.0803 87.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="88.3632, -110.0803 88.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="89.3632, -110.0803 89.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="90.3632, -110.0803 90.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="91.3632, -110.0803 91.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="92.3632, -110.0803 92.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="93.3632, -110.0803 93.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="94.3632, -110.0803 94.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="95.3632, -110.0803 95.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="96.3632, -110.0803 96.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="97.3632, -110.0803 97.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="98.3632, -110.0803 98.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="99.3632, -110.0803 99.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="100.3632, -110.0803 100.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="101.3632, -110.0803 101.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="102.3632, -110.0803 102.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="103.3632, -110.0803 103.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="104.3632, -110.0803 104.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="105.3632, -110.0803 105.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="106.3632, -110.0803 106.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="107.3632, -110.0803 107.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="108.3632, -110.0803 108.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="109.3632, -110.0803 109.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="110.3632, -110.0803 110.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="111.3632, -110.0803 111.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="112.3632, -110.0803 112.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="113.3632, -110.0803 113.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="114.3632, -110.0803 114.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="115.3632, -110.0803 115.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="116.3632, -110.0803 116.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="117.3632, -110.0803 117.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="118.3632, -110.0803 118.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="119.3632, -110.0803 119.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="120.3632, -110.0803 120.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="121.3632, -110.0803 121.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="122.3632, -110.0803 122.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="123.3632, -110.0803 123.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="124.3632, -110.0803 124.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="125.3632, -110.0803 125.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="126.3632, -110.0803 126.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="127.3632, -110.0803 127.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="128.3632, -110.0803 128.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="129.3632, -110.0803 129.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="130.3632, -110.0803 130.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="131.3632, -110.0803 131.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="132.3632, -110.0803 132.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="133.3632, -110.0803 133.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="134.3632, -110.0803 134.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="135.3632, -110.0803 135.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="136.3632, -110.0803 136.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="137.3632, -110.0803 137.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="138.3632, -110.0803 138.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="139.3632, -110.0803 139.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="140.3632, -110.0803 140.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="141.3632, -110.0803 141.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="142.3632, -110.0803 142.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="143.3632, -110.0803 143.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="144.3632, -110.0803 144.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="145.3632, -110.0803 145.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="146.3632, -110.0803 146.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="147.3632, -110.0803 147.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="148.3632, -110.0803 148.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="149.3632, -110.0803 149.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="150.3632, -110.0803 150.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="151.3632, -110.0803 151.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="152.3632, -110.0803 152.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="153.3632, -110.0803 153.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="154.3632, -110.0803 154.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="155.3632, -110.0803 155.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="156.3632, -110.0803 156.3632, 119.0011 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>

{/* //<polyline shape-rendering="crispEdges" points="-40.3632, 112.0803 156.4795, 112.0803 " stroke-opacity="0.3000" stroke-width="0.1000"></polyline> */}
{/* <polyline shape-rendering="crispEdges" points="-40.3632, 89.0803 156.4795, 89.0803 " stroke-opacity="0.3000" stroke-width="0.1000"></polyline> */}

            {/* horizontal lines */}
            <polyline shapeRendering="crispEdges" points="-40.3632, -1.0803 156.4795, -1.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -2.0803 156.4795, -2.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -3.0803 156.4795, -3.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -4.0803 156.4795, -4.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -5.0803 156.4795, -5.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -6.0803 156.4795, -6.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -7.0803 156.4795, -7.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -8.0803 156.4795, -8.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -9.0803 156.4795, -9.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -10.0803 156.4795, -10.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -11.0803 156.4795, -11.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -12.0803 156.4795, -12.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -13.0803 156.4795, -13.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -14.0803 156.4795, -14.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -15.0803 156.4795, -15.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -16.0803 156.4795, -16.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -17.0803 156.4795, -17.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -18.0803 156.4795, -18.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -19.0803 156.4795, -19.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -20.0803 156.4795, -20.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -21.0803 156.4795, -21.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -22.0803 156.4795, -22.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -23.0803 156.4795, -23.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -24.0803 156.4795, -24.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -25.0803 156.4795, -25.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -26.0803 156.4795, -26.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -27.0803 156.4795, -27.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -28.0803 156.4795, -28.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -29.0803 156.4795, -29.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -30.0803 156.4795, -30.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -31.0803 156.4795, -31.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -32.0803 156.4795, -32.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -33.0803 156.4795, -33.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -34.0803 156.4795, -34.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -35.0803 156.4795, -35.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -36.0803 156.4795, -36.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -37.0803 156.4795, -37.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -38.0803 156.4795, -38.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -39.0803 156.4795, -39.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -40.0803 156.4795, -40.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -41.0803 156.4795, -41.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -42.0803 156.4795, -42.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -43.0803 156.4795, -43.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -44.0803 156.4795, -44.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -45.0803 156.4795, -45.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -46.0803 156.4795, -46.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -47.0803 156.4795, -47.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -48.0803 156.4795, -48.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -49.0803 156.4795, -49.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -50.0803 156.4795, -50.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -51.0803 156.4795, -51.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -52.0803 156.4795, -52.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -53.0803 156.4795, -53.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -54.0803 156.4795, -54.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -55.0803 156.4795, -55.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -56.0803 156.4795, -56.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -57.0803 156.4795, -57.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -58.0803 156.4795, -58.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -59.0803 156.4795, -59.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -60.0803 156.4795, -60.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -61.0803 156.4795, -61.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -62.0803 156.4795, -62.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -63.0803 156.4795, -63.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -64.0803 156.4795, -64.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -65.0803 156.4795, -65.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -66.0803 156.4795, -66.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -67.0803 156.4795, -67.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -68.0803 156.4795, -68.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -69.0803 156.4795, -69.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -70.0803 156.4795, -70.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -71.0803 156.4795, -71.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -72.0803 156.4795, -72.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -73.0803 156.4795, -73.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -74.0803 156.4795, -74.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -75.0803 156.4795, -75.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -76.0803 156.4795, -76.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -77.0803 156.4795, -77.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -78.0803 156.4795, -78.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -79.0803 156.4795, -79.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -80.0803 156.4795, -80.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -81.0803 156.4795, -81.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -82.0803 156.4795, -82.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -83.0803 156.4795, -83.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -84.0803 156.4795, -84.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -85.0803 156.4795, -85.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -86.0803 156.4795, -86.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -87.0803 156.4795, -87.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -88.0803 156.4795, -88.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -89.0803 156.4795, -89.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -90.0803 156.4795, -90.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -91.0803 156.4795, -91.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -92.0803 156.4795, -92.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -93.0803 156.4795, -93.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -94.0803 156.4795, -94.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -95.0803 156.4795, -95.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -96.0803 156.4795, -96.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -97.0803 156.4795, -97.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -98.0803 156.4795, -98.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -99.0803 156.4795, -99.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -100.0803 156.4795, -100.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -101.0803 156.4795, -101.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -102.0803 156.4795, -102.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -103.0803 156.4795, -103.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -104.0803 156.4795, -104.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -105.0803 156.4795, -105.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -106.0803 156.4795, -106.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -107.0803 156.4795, -107.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -108.0803 156.4795, -108.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -109.0803 156.4795, -109.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -110.0803 156.4795, -110.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>

            <polyline shapeRendering="crispEdges" points="-40.3632, 0.0803 156.4795, 0.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>

            <polyline shapeRendering="crispEdges" points="-40.3632, 1.0803 156.4795, 1.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 2.0803 156.4795, 2.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 3.0803 156.4795, 3.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 4.0803 156.4795, 4.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 5.0803 156.4795, 5.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 6.0803 156.4795, 6.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 7.0803 156.4795, 7.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 8.0803 156.4795, 8.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 9.0803 156.4795, 9.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 10.0803 156.4795, 10.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 11.0803 156.4795, 11.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 12.0803 156.4795, 12.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 13.0803 156.4795, 13.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 14.0803 156.4795, 14.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 15.0803 156.4795, 15.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 16.0803 156.4795, 16.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 17.0803 156.4795, 17.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 18.0803 156.4795, 18.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 19.0803 156.4795, 19.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 20.0803 156.4795, 20.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 21.0803 156.4795, 21.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 22.0803 156.4795, 22.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 23.0803 156.4795, 23.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 24.0803 156.4795, 24.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 25.0803 156.4795, 25.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 26.0803 156.4795, 26.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 27.0803 156.4795, 27.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 28.0803 156.4795, 28.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 29.0803 156.4795, 29.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 30.0803 156.4795, 30.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 31.0803 156.4795, 31.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 32.0803 156.4795, 32.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 33.0803 156.4795, 33.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 34.0803 156.4795, 34.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 35.0803 156.4795, 35.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 36.0803 156.4795, 36.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 37.0803 156.4795, 37.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 38.0803 156.4795, 38.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 39.0803 156.4795, 39.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 40.0803 156.4795, 40.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 41.0803 156.4795, 41.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 42.0803 156.4795, 42.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 43.0803 156.4795, 43.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 44.0803 156.4795, 44.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 45.0803 156.4795, 45.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 46.0803 156.4795, 46.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 47.0803 156.4795, 47.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 48.0803 156.4795, 48.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 49.0803 156.4795, 49.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 50.0803 156.4795, 50.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 51.0803 156.4795, 51.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 52.0803 156.4795, 52.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 53.0803 156.4795, 53.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 54.0803 156.4795, 54.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 55.0803 156.4795, 55.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 56.0803 156.4795, 56.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 57.0803 156.4795, 57.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 58.0803 156.4795, 58.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 59.0803 156.4795, 59.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 60.0803 156.4795, 60.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 61.0803 156.4795, 61.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 62.0803 156.4795, 62.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 63.0803 156.4795, 63.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 64.0803 156.4795, 64.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 65.0803 156.4795, 65.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 66.0803 156.4795, 66.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 67.0803 156.4795, 67.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 68.0803 156.4795, 68.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 69.0803 156.4795, 69.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 70.0803 156.4795, 70.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 71.0803 156.4795, 71.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 72.0803 156.4795, 72.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 73.0803 156.4795, 73.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 74.0803 156.4795, 74.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 75.0803 156.4795, 75.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 76.0803 156.4795, 76.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 77.0803 156.4795, 77.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 78.0803 156.4795, 78.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 79.0803 156.4795, 79.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 80.0803 156.4795, 80.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 81.0803 156.4795, 81.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 82.0803 156.4795, 82.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 83.0803 156.4795, 83.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 84.0803 156.4795, 84.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 85.0803 156.4795, 85.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 86.0803 156.4795, 86.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 87.0803 156.4795, 87.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 88.0803 156.4795, 88.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 89.0803 156.4795, 89.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 90.0803 156.4795, 90.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 91.0803 156.4795, 91.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 92.0803 156.4795, 92.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 93.0803 156.4795, 93.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 94.0803 156.4795, 94.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 95.0803 156.4795, 95.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 96.0803 156.4795, 96.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 97.0803 156.4795, 97.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 98.0803 156.4795, 98.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 99.0803 156.4795, 99.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 100.0803 156.4795, 100.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 101.0803 156.4795, 101.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 102.0803 156.4795, 102.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 103.0803 156.4795, 103.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 104.0803 156.4795, 104.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 105.0803 156.4795, 105.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 106.0803 156.4795, 106.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 107.0803 156.4795, 107.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 108.0803 156.4795, 108.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 109.0803 156.4795, 109.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 110.0803 156.4795, 110.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 111.0803 156.4795, 111.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 112.0803 156.4795, 112.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 113.0803 156.4795, 113.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 114.0803 156.4795, 114.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 115.0803 156.4795, 115.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 116.0803 156.4795, 116.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 117.0803 156.4795, 117.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 118.0803 156.4795, 118.0803 " strokeOpacity="0.3000" strokeWidth="0.1000"></polyline>


            {/* dark-vertical lines */}
            <polyline shapeRendering="crispEdges" points="-10.3632, -110.0803 -10.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-20.3632, -110.0803 -20.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-30.3632, -110.0803 -30.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -110.0803 -40.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>

            <polyline shapeRendering="crispEdges" points="0.3632, -110.0803 0.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>

            <polyline shapeRendering="crispEdges" points="10.3632, -110.0803 10.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="20.3632, -110.0803 20.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="30.3632, -110.0803 30.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="40.3632, -110.0803 40.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="50.3632, -110.0803 50.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="60.3632, -110.0803 60.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="70.3632, -110.0803 70.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="80.3632, -110.0803 80.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="90.3632, -110.0803 90.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="100.3632, -110.0803 100.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="110.3632, -110.0803 110.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="120.3632, -110.0803 120.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="130.3632, -110.0803 130.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="140.3632, -110.0803 140.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="150.3632, -110.0803 150.3632, 119.0011 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>

            {/* dark-horizontallines */}
            <polyline shapeRendering="crispEdges" points="-40.3632, -10.0803 156.4795, -10.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -20.0803 156.4795, -20.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -30.0803 156.4795, -30.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -40.0803 156.4795, -40.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -50.0803 156.4795, -50.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -60.0803 156.4795, -60.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -70.0803 156.4795, -70.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -80.0803 156.4795, -80.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -90.0803 156.4795, -90.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -100.0803 156.4795, -100.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, -110.0803 156.4795, -110.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>

            <polyline shapeRendering="crispEdges" points="-40.3632, 0.0803 156.4795, 0.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>


            <polyline shapeRendering="crispEdges" points="-40.3632, 10.0803 156.4795, 10.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 20.0803 156.4795, 20.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 30.0803 156.4795, 30.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 40.0803 156.4795, 40.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 50.0803 156.4795, 50.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 60.0803 156.4795, 60.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 70.0803 156.4795, 70.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 80.0803 156.4795, 80.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 90.0803 156.4795, 90.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 100.0803 156.4795, 100.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            <polyline shapeRendering="crispEdges" points="-40.3632, 110.0803 156.4795, 110.0803 " strokeOpacity="1.0000" strokeWidth="0.1000"></polyline>
            {/* <polyline shapeRendering="auto" points="46.6430, 61.7346 47.1430, 61.7345 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="68.7836, 61.7346 68.2836, 61.7345 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="44.1686, 23.0242 44.6680, 23.0487 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="68.8602, 23.0242 68.3602, 23.0242 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="67.8532, 2.1076 67.8773, 2.6070 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="46.6545, 113.3712 47.1545, 113.3712 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="68.7720, 113.3712 68.2720, 113.3712 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="69.8429, 12.2799 69.3435, 12.3040 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="67.8532, 2.1076 68.8425, 22.6578 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="69.3483, 2.0048 70.3255, 22.3049 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="35.2732, 65.2393 34.7732, 65.2357 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="9.1326, 65.2393 9.6326, 65.2392 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="41.3854, 26.9652 40.8856, 26.9530 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="13.3092, 22.0467 13.7966, 22.1581 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="9.1441, 116.8759 9.6441, 116.8759 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="35.2616, 116.8759 34.7616, 116.8759 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="19.0151, 1.5481 18.9307, 2.0409 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="15.7541, 11.7223 16.2415, 11.8336 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="15.5245, 12.6956 16.0120, 12.8069 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="31.0317, 3.6962 26.7723, 19.2903 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="117.2018, 5.6179 117.2018, 5.1179 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="115.2018, 5.6179 115.2018, 5.1179 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="117.2018, 1.6179 117.2018, 2.1179 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="115.2018, 1.6179 115.2018, 2.1179 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="77.0492, 5.6179 77.0492, 1.6179 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="80.1574, 19.1854 79.6574, 19.1854 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="75.1589, 19.1854 75.6589, 19.1854 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
            {/* <polyline shapeRendering="auto" points="77.6582, 8.8368 77.6582, 29.4724 " strokeOpacity="1.0000" strokeWidth="0.2500"></polyline> */}
          
         
            
          </g>
         
        </svg>
      </div>
    </div>
    {/* Button to trigger download */}
    <div className="grid-d pt-20">
      {/* <button className="download-button" onClick={generateAndSendPDF}>Backend PDF</button> */}

      <button className="download-button" onClick={downloadPDF}>Download PDF2</button>
      <button className="download-button" onClick={handleDownloadimage}>Download Image</button>
    </div>

  <div className="mt-80">
      <svg
        ref={svgRefFront}
        width="21cm"
        height="29cm"
        viewBox="-0 -115 130 240.0034"
        baseProfile="full"
        xmlns="http://www.w3.org/2000/svg"
        transform="scale(1, -1)"
        
      >
        {generateFront1view()}


      </svg>
      <svg
        ref={svgRefFront2}
        width="21cm"
        height="29cm"
        viewBox="-0 -115 130 240.0034"
        baseProfile="full"
        xmlns="http://www.w3.org/2000/svg"
        transform="scale(1, -1)"
        
      >
      {generateBack2view()}
      </svg>
    </div>
  
  </>
);};

export default Vectorimagecomponent;

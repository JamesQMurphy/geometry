var selectedElement = 0;
var currentX = 0;
var currentY = 0;
var screenCTM = 0;

function attachSvgCoords(evt) {
  var pt = evt.target.ownerSVGElement.createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  var svgPt = pt.matrixTransform(screenCTM.inverse());
  evt.svgX = svgPt.x;
  evt.svgY = svgPt.y;
}

function selectElement(evt) {
      selectedElement = evt.target;
      screenCTM = selectedElement.getScreenCTM();
    attachSvgCoords(evt);
  currentX = evt.svgX;
  currentY = evt.svgY;
  console.log(`element ${selectedElement.id} ${evt.svgX} ${evt.svgY}`);

  selectedElement.onmousemove=moveElement;
  selectedElement.onmouseout=deselectElement;
  selectedElement.onmouseup=deselectElement;
}

function deselectElement(evt){
if(selectedElement != 0){
  selectedElement.onmousemove = null;
  selectedElement.onmouseout = null;
  selectedElement.onmouseup = null;
  selectedElement = 0;
}
}

// rewrite with just transforms
function moveElement(evt){
    attachSvgCoords(evt);
  //console.log(`element ${selectedElement.id} ${evt.svgX} ${evt.svgY}`);
  var dx = evt.svgX - currentX;
  var dy = evt.svgY - currentY;
  //console.log(`dx=${dx} dy=${dy}`);
  var xform = `translate(${dx},${dy})`;
      //console.log(xform);

  //selectedElement.setAttribute("transform", xform);
  selectedElement.setAttribute("cx", evt.svgX);
  selectedElement.setAttribute("cy", evt.svgY);

  currentX = evt.svgX;
  currentY = evt.svgY;
  //console.log(`currentX=${currentX} currentY=${currentY}`);
}  



function makeDraggable(elem) {
//	elem.setAttribute('fill','blue');
  elem.setAttribute('transform','matrix(1 0 0 1 0 0)');
elem.onmousedown=selectElement;
}




var c = document.getElementById("theCirc");
makeDraggable(c);




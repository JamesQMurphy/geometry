'use strict';



function SmartSvg(svg) {
    this.svg = svg;
    this.draggingElem = null;
    this.dragOrigin = null;
    this.dragMatrix = null;
    var self = this;
    
    recurseEachElement(initElement);
    

    function initElement(elem) {
        
        // TODO: if draggable
        // Append a transform(0 0) to the element.  This is how we will move the element.
        var transform = self.svg.createSVGTransform();
        transform.setTranslate(0,0);
        elem.transform.baseVal.appendItem(transform);




        elem.onmousedown=beginSvgDrag;

    }





    function beginSvgDrag(evt) {
        //debugger;
        this.draggingElem = evt.target;
        var currentElemTransformList = this.draggingElem.transform.baseVal;
        var currentElemTransform = currentElemTransformList.getItem(currentElemTransformList.length-1);

        this.dragOrigin = {x:evt.clientX, y:evt.clientY};
        this.dragCurrentLocation = {x:currentElemTransform.matrix.e, y:currentElemTransform.matrix.f};
        this.dragMatrix = this.draggingElem.getScreenCTM().inverse();

        this.draggingElem.onmousemove = duringSvgDrag;
        this.draggingElem.onmouseup = endSvgDrag;
        this.draggingElem.onmouseout = endSvgDrag;  // TODO: abort?
        
    }

    function duringSvgDrag(evt) {
        

        // Calculate how far from the origin
        //var pt = self.svg.createSVGPoint();
        //debugger;
        var clientDx = evt.clientX - this.dragOrigin.x;
        var clientDy = evt.clientY - this.dragOrigin.y;

        // Figure out how far it moved in local coordinates
        var mtx = this.dragMatrix;
        //debugger;
        var dx = (clientDx * mtx.a) + (clientDy * mtx.b) + this.dragCurrentLocation.x;
        var dy = (clientDx * mtx.c) + (clientDy * mtx.d) + this.dragCurrentLocation.y;

        // Move the element by replacing the last transform with a new one
        //console.log(this.draggingElem.transfer);
        var transformList = this.draggingElem.transform.baseVal;
        var newTransform = self.svg.createSVGTransform();
        newTransform.setTranslate(dx, dy);
        transformList.replaceItem(newTransform, transformList.length-1);
    }

    function endSvgDrag(evt) {
        if (this.draggingElem) {
            this.draggingElem.onmousemove = null;
            this.draggingElem.onmouseout = null;
            this.draggingElem.onmouseup = null;

            this.draggingElem = null;
            this.dragOrigin = null;
        }
    }

    //TODO: make arrow function
    function recurseEachElement(fn, elem = self.svg) {
        var theChildren = elem.children;
        for (var i=0; i < theChildren.length; i++) {
            let child = theChildren[i];
            fn(child);
            recurseEachElement(fn, child);
        }
    }
}








for( var s of document.getElementsByTagName("svg")) {
    let o = new SmartSvg(s);
}
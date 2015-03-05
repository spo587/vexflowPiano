function makeContext(elementId) {
    var canvas = document.getElementById(elementId);
    var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
    var ctx = renderer.getContext();
    return ctx;
}




function makeBars(numBars, height, width) {
    /// make a bunch of bar instances for vex flow
    var bars = [new Vex.Flow.Stave(25, height, width + 50)];
    for (var i=1; i < numBars; i += 1) {
        var last_added_bar = bars[bars.length - 1];
        var newBar = new Vex.Flow.Stave(last_added_bar.width + last_added_bar.x, last_added_bar.y, width);
        //newBar.setEndBarType(Vex.Flow.Barline.type.SINGLE);
        bars.push(newBar);
    }
    return bars;
}


// makes a piano grand staff and renders it to the page
//was thinking perhaps to separate out the rendering and the creation of the object. later
function makePianoStaffSingleLine(numBars, key, timeSig, width, height) {
    //todo make the first bar bigger
    var bars_rh = makeBars(numBars, height, width);
    //var add_to_rh = makeBars(numBars - 1, height, width);
    var bars_lh = makeBars(numBars, height + 80, width);

    bars_rh[0].addClef('treble');
    
    //var keySig = new SharpMajorScale(key).tonic;

    //bars_rh[0].addKeySignature(keySig);
    bars_rh[0].addTimeSignature(timeSig);
    bars_lh[0].addClef('bass');
    //bars_lh[0].addKeySignature(keySig);
    bars_lh[0].addTimeSignature(timeSig);
    //bars_lh[1].x += numSharps * 25; //  make first bar wider for sharps
    return {bars_rh: bars_rh, bars_lh: bars_lh, timeSig: timeSig};
}


//uses the above function to make multiple lines of piano staff
function makePianoStaffMultipleLines(key, timeSig, barsPerLine, numLines, distance_from_top){
    if (key === undefined) {
        var key = 0;
    }
    //var distance_from_top = 10;
    var lines = [];
    for (var i=0; i<numLines; i+=1) {
        var line = makePianoStaffSingleLine(barsPerLine, key, timeSig, 900/barsPerLine, distance_from_top);
        distance_from_top += 200;
        lines.push(line);
    }
    return lines;
}

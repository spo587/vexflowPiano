function createVoice(notes, numbeats, beat_value) {
    // take the notes and return a voice instance for a single bar only, cause that seems to be how vexflow does things
    //not ideal....wish it would work for multiple bars!!
  var voice = new Vex.Flow.Voice({
    num_beats: numbeats,
    beat_value: beat_value,
    resolution: Vex.Flow.RESOLUTION
  });
  voice.addTickables(notes);
  return voice;
}


function createSingleNote(chroma, octave, accidental, duration, clef, fingering) {
    // create a note instance for vex flow given the inputs
    if (accidental === null) {
        accidental = '';
    }
    var durationLength = duration.length;
    if (duration[durationLength - 1] === 'r') { //the note is a rest. set its position in center of staff
        chroma = clef === 'treble' ? 'b' : 'd';
        octave = clef === 'treble' ? '4' : '3';
    }
    var note = new Vex.Flow.StaveNote({ keys:[chroma+accidental+'/'+octave], duration: duration, clef:clef, auto_stem: true});
    //if accidentals, need to chain
    if (accidental !== '') {
        note.addAccidental(0, new Vex.Flow.Accidental(accidental));
    }
    // dotted notes
    if (duration[duration.length - 1] === 'd') {
        note.addDotToAll();
    }

    if (fingering !== undefined && fingering !== '') {
        note.addModifier(0, newStringNumber(fingering, Vex.Flow.Modifier.Position.ABOVE));
    }
    return note;
}



function formatVoice(voice, stave, context) {
    //render a non-transposed voice to the stave
    var beams = Vex.Flow.Beam.applyAndGetBeams(voice);
    var formatter = new Vex.Flow.Formatter().joinVoices([voice]).formatToStave([voice], stave);
    voice.draw(context,stave);
    for (var i=0; i< beams.length; i+=1){
        beams[i].setContext(context).draw();
    }
    
    // var beams = beamVoiceByBeat(voice, 4, stave);
    // renderBeams(beams);
}



//new stuff for adding your own notes to a score

function addNotesToScore(notes, linesObject, line, measureNumber, beatsPerMeasure, beatValue, clef){
    var voice = createVoice(notes, beatsPerMeasure, beatValue);
    if (clef === 'bass'){
        formatVoice(voice, linesObject[line].bars_lh[measureNumber], ctx);
    }
    else if (clef === 'treble'){
        formatVoice(voice, linesObject[line].bars_rh[measureNumber], ctx);
    }
}


var ctx = makeContext('canvas-1');

lines = makePianoStaffMultipleLines(0, '4/4', 6, 3, 0);
renderBarsMultipleLines(lines, ctx);

var first = createSingleNote('a', 4, '', 'q', 'treble');
var second = createSingleNote('g', 4, '', 'h', 'treble');

var oneMeasure = [first, second];

var firstLeft = createSingleNote('a', 2, '', 'q', 'bass');
var secondLeft = createSingleNote('g', 2, '', 'h', 'bass');

var lhMeasure = [firstLeft, secondLeft];

//uncomment next two lines to see the first measure rendered
// addNotesToScore(oneMeasure, lines, 0, 0, 4, 4, 'right');
// addNotesToScore(lhMeasure, lines, 0, 0, 4, 4, 'left');

function compose(firstNote, intervals, clef, ctx){
    //lets write something out as a series of interval / rhythmic interval pairs
    // start with just quarter notes, write out the intervals, for simplicity for now
    //make sure first note is a quarter note, and we're in 4/4
    var transpose_dict_sharp_from_c = {0: 'c', 1:'d', 2:'e', 3:'f', 4:'g', 5:'a', 6:'b'};
    var notes = [firstNote];
    //lets start on c, for concreteness....all this could be modified but not trivially
    //map each interval to a note
    intervals.forEach(function(interval){
        var note = createSingleNote(transpose_dict_sharp_from_c[interval], Number(firstNote.keyProps[0].octave), '','q', clef);
        notes.push(note);
    });
    console.log(notes);
    //now the notes array is just a list of note objects. we need to add them to the score, 4 at a time
    for (var i=0; i<notes.length / 4; i+=1){
        var oneMeasure = notes.slice(i*4, i*4 + 4);
        console.log(oneMeasure);
        addNotesToScore(oneMeasure, lines, 0, i, 4, 4, clef);  
    }

}

compose(first, [2, 3, 4, 5, 6, 3, 2], 'treble', ctx);

compose(firstLeft, [2, 3, 4, 5, 6, 3, 2] , 'bass', ctx);





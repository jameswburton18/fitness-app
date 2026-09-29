/* Exercise animations for Sturdy. Keyed by exercise name (the `n` in the program data).
   See figure.js for the pose format. Default camera: side view, figure facing screen-right,
   seeing the figure's RIGHT side (right limbs are "near"). Author the working side as the RIGHT
   side; the app mirrors the drawing for "Left side" sets.
   seq: [[poseName, secondsToReachIt, ease?], ...] — loops. The first entry's time is the
   return-to-start time at the end of each loop. Tempo cues in the program (e.g. "3s down")
   should be reflected in these durations. */
window.MOVES = window.MOVES || {};
window.POSE = (function(){
  const arms = {lA:{s:[4,6,0], e:12}, rA:{s:[4,6,0], e:12}};
  return {
    // standing tall, feet hip-width, facing +z
    stand: ()=>({root:[0,94.6,0], pel:[0,0,0], sp:[0,0,0], nk:[0,0], lL:{pl:[10,0,13]}, rL:{pl:[-10,0,13]}, ...JSON.parse(JSON.stringify(arms))}),
    // lying on the back, knees bent, feet flat (head toward -z)
    hookLying: ()=>({root:[0,11,0], pel:[-90,0,0], sp:[0,0,0], nk:[18,0],
      lL:{pl:[10,0,50], pole:[0,0,1]}, rL:{pl:[-10,0,50], pole:[0,0,1]},
      lA:{ik:[22,3,-4], pole:[1,0,0]}, rA:{ik:[-22,3,-4], pole:[-1,0,0]}}),
    // hands and knees (facing +z), back flat
    quadruped: ()=>({root:[0,52,-10], pel:[85,0,0], sp:[0,0,0], nk:[-8,0],   // knees under hips on the floor, wrists under shoulders
      lL:{ik:[11,6,-53], pole:[0,0,1], a:-60}, rL:{ik:[-11,6,-53], pole:[0,0,1], a:-60},
      lA:{ik:[17,3,34], pole:[0.3,-1,0], hd:[0,0,1]}, rA:{ik:[-17,3,34], pole:[-0.3,-1,0], hd:[0,0,1]}}),
  };
})();

(function(M, P){
const clone=o=>JSON.parse(JSON.stringify(o));

M['High box squat'] = {
  props:[{box:[-40,40,0,56,-95,-20], k:'soft'}],
  hl:['rThigh','lThigh'],
  base: P.stand(),
  poses:{
    up:{},
    down:{root:[0,66,-27], pel:[30,0,0], sp:[6,0,0], nk:[-10,0], lA:{s:[70,6,0], e:8}, rA:{s:[70,6,0], e:8}},
  },
  seq:[['up',1.4],['down',3],['down',0.4],['up',1.4]],
};

M['Glute bridge'] = {
  hl:['rThigh','lThigh'],
  base: P.hookLying(),
  poses:{
    down:{},
    up:{root:[0,36,0], pel:[-122,0,0], nk:[40,0]},
  },
  seq:[['down',1],['up',1.2],['up',2],['down',1.4]],
};

M['Push-up'] = {
  hl:['rUpper','lUpper'],
  base:{pel:[68,0,0], sp:[0,0,0], nk:[-12,0], pin:{j:'rBall', at:[-9,0,-92]},
    lL:{h:[0,2,0], k:0, a:-70, t:70}, rL:{h:[0,2,0], k:0, a:-70, t:70},
    lA:{ik:[17,3,40], pole:[0.7,-1,0], hd:[0,0,1]}, rA:{ik:[-17,3,40], pole:[-0.7,-1,0], hd:[0,0,1]}},
  poses:{ up:{}, down:{pel:[84,0,0]} },
  seq:[['up',1],['down',2],['up',1.2]],
};

M['Slow calf raises'] = {
  props:[{box:[-40,40,0,190,40,46], k:'wall', noFit:true}],
  hl:['rShin','lShin'],
  base:Object.assign(P.stand(), {lA:{ik:[16,120,38], pole:[0.4,-1,-0.5]}, rA:{ik:[-16,120,38], pole:[-0.4,-1,-0.5]}}),
  poses:{ down:{}, up:{root:[0,103,2], lL:{pl:[10,0,13], hl:34}, rL:{pl:[-10,0,13], hl:34}} },
  seq:[['down',1],['up',2],['up',1],['down',3]],
};

M['Cat–cow'] = {
  hl:[],
  base:P.quadruped(),
  poses:{ cat:{sp:[-20,0,0], ch:[-14,0,0], nk:[35,0], pel:[98,0,0]}, cow:{sp:[20,0,0], ch:[12,0,0], nk:[-35,0], pel:[84,0,0]} },
  seq:[['cat',2.5],['cow',2.5]],
};

M['Side plank'] = {
  cam:{yaw:18, pitch:10},
  hl:['lumbar','hips'],
  base:{pel:[0,72,0], sp:[0,0,0], nk:[0,-10], pin:{j:'rAnk', at:[82,8,0]},
    lL:{h:[0,0,0], k:0, a:0}, rL:{h:[0,0,0], k:0, a:0},
    rA:{ik:[-45,3,24], pole:[0,-1,-0.3], hd:[0,0,1]}, lA:{s:[0,8,0], e:10}},
  poses:{ up:{}, sag:{pel:[0,80,0]} },
  seq:[['up',1.5],['up',2],['sag',1.5],['up',1.5]],
};
})(window.MOVES, window.POSE);

/* ---- a ---- */
/* Part A: lower-body strength, conditioning, warm-up and balance demos. */
(function(M,P){
const C=o=>JSON.parse(JSON.stringify(o));
const ARM={s:[4,6,0], e:12};
const STAIR_FRONT=[-40,40,0,18,22,50];       // bottom stair in front of the figure

// ---------- Step-up ----------
M['Step-up'] = {
  props:[{box:STAIR_FRONT}],
  hl:['rThigh','hips'],
  base:P.stand(),
  poses:{
    start:{},
    rlift:{root:[0,94.6,1], pel:[5,0,0], rL:{pl:[-10,30,28]}},
    place:{root:[0,94,5], pel:[10,0,0], sp:[4,0,0], rL:{pl:[-10,18,44]}},
    drive:{root:[0,104,20], pel:[12,0,0], sp:[3,0,0], rL:{pl:[-10,18,44]}, lL:{pl:[10,8,6], hl:40}},
    llift:{root:[0,110.5,27], pel:[5,0,0], rL:{pl:[-10,18,44]}, lL:{pl:[10,28,30]}},
    top:{root:[0,112.6,30], rL:{pl:[-10,18,44]}, lL:{pl:[10,18,44]}},
    lback:{root:[0,108,24], pel:[6,0,0], rL:{pl:[-10,18,44]}, lL:{pl:[10,24,20], hl:30}},
  },
  seq:[['start',0.5],['rlift',0.45],['place',0.4],['drive',0.6],['llift',0.35],['top',0.35],['top',0.4],['lback',0.5],['place',0.55],['rlift',0.4],['start',0.4]],
};

// ---------- Box squat to a chair ----------
M['Box squat to a chair'] = {
  props:[{box:[-22,22,0,45,-64,-22]}, {box:[-22,22,45,92,-68,-64]}],
  hl:['rThigh','lThigh','hips'],
  base:P.stand(),
  poses:{
    up:{},
    down:{root:[0,54,-36], pel:[38,0,0], sp:[6,0,0], nk:[-12,0], lA:{s:[75,6,0], e:8}, rA:{s:[75,6,0], e:8}},
  },
  seq:[['up',1.2],['down',3],['down',0.4],['up',1.4]],
};

// ---------- Split squat ----------
M['Split squat'] = {
  props:[{box:[2,18,0,2.5,-34,-14], k:'towel'}],
  hl:['rThigh','hips'],
  base:{root:[0,82,-12], pel:[0,0,0], sp:[0,0,0], nk:[0,0],
    rL:{pl:[-10,0,40]}, lL:{pl:[10,0,-64], hl:55},
    lA:C(ARM), rA:C(ARM)},
  poses:{
    up:{},
    down:{root:[0,56,-15], pel:[4,0,0]},
  },
  seq:[['up',1],['down',2],['down',0.3],['up',1.5]],
};

// ---------- Step-down ----------
M['Step-down'] = {
  props:[{box:[-40,40,0,18,-32,-4]}],
  hl:['rThigh','hips'],
  base:{root:[0,112.6,-22], pel:[0,0,0], sp:[0,0,0], nk:[0,0],
    rL:{pl:[-10,18,-8]}, lL:{pl:[10,24,14], hl:-10},
    lA:{s:[20,10,0], e:20}, rA:{s:[20,10,0], e:20}},
  poses:{
    top:{},
    down:{root:[0,87,-30], pel:[18,0,0], sp:[4,0,0], nk:[-8,0], lL:{pl:[10,4.9,18], hl:-15}, lA:{s:[45,10,0], e:15}, rA:{s:[45,10,0], e:15}},
  },
  seq:[['top',1],['down',3],['down',0.3],['top',1.3]],
};

// ---------- Rear-foot-elevated split squat ----------
M['Rear-foot-elevated split squat'] = {
  props:[{box:[-50,50,0,42,-125,-58], k:'soft'}],
  hl:['rThigh','hips'],
  base:{root:[0,86,-18], pel:[4,0,0], sp:[0,0,0], nk:[0,0],
    rL:{pl:[-10,0,32]}, lL:{ik:[10,46,-64], pole:[0,0,1], a:-60},
    lA:C(ARM), rA:C(ARM)},
  poses:{
    up:{},
    down:{root:[0,56,-22], pel:[12,0,0], sp:[2,0,0], lL:{ik:[10,46,-64], pole:[0,0,1], a:-20}},
  },
  seq:[['up',1],['down',2],['down',0.3],['up',1.5]],
};

// ---------- Skater squat ----------
M['Skater squat'] = {
  props:[{box:[-2,24,0,10,-48,-22], k:'soft'}],
  hl:['rThigh','hips'],
  base:{root:[-3,93,0], pel:[4,0,0], sp:[0,0,0], nk:[0,0],
    rL:{pl:[-7,0,13]}, lL:{h:[-5,0,0], k:75, a:-20},
    lA:{s:[25,6,0], e:10}, rA:{s:[25,6,0], e:10}},
  poses:{
    up:{},
    down:{root:[-3,60,-18], pel:[40,0,0], sp:[8,0,0], nk:[-18,0], lL:{h:[30,0,0], k:95, a:-20},
      lA:{s:[125,6,0], e:0}, rA:{s:[125,6,0], e:0}},
  },
  seq:[['up',1],['down',2.5],['down',0.3],['up',1.5]],
};

// ---------- Wall sit ----------
M['Wall sit'] = {
  props:[{box:[-40,40,0,190,-40,-35], k:'wall', noFit:true}],
  hl:['rThigh','lThigh'],
  base:{root:[0,72,-22], pel:[0,0,0], sp:[0,0,0], nk:[0,0],
    rL:{pl:[-10,0,31]}, lL:{pl:[10,0,31]},
    rA:{s:[10,12,0], e:30}, lA:{s:[10,12,0], e:30}},
  poses:{
    out:{},
    in:{root:[0,72.6,-22], ch:[-4,0,0], nk:[-3,0], rA:{s:[12,13,0], e:30}, lA:{s:[12,13,0], e:30}},
  },
  seq:[['out',2],['in',2]],
};

// ---------- Quick step-ups (alternating lead leg) ----------
(function(){
  const st=P.stand();
  M['Quick step-ups'] = {
    props:[{box:STAIR_FRONT}],
    hl:['rThigh','lThigh'],
    base:st,
    poses:{
      s0:{},
      rL:{root:[0,94.6,2], pel:[5,0,0], rL:{pl:[-10,30,28]}, lA:{s:[25,6,0], e:25}, rA:{s:[-15,6,0], e:25}},
      rP:{root:[0,94,5], pel:[10,0,0], rL:{pl:[-10,18,44]}, lA:{s:[25,6,0], e:25}, rA:{s:[-15,6,0], e:25}},
      lHi:{root:[0,109,25], pel:[6,0,0], rL:{pl:[-10,18,44]}, lL:{pl:[10,28,30]}, lA:{s:[-10,6,0], e:25}, rA:{s:[20,6,0], e:25}},
      top:{root:[0,112.6,30], rL:{pl:[-10,18,44]}, lL:{pl:[10,18,44]}},
      rHi:{root:[0,109,25], pel:[6,0,0], lL:{pl:[10,18,44]}, rL:{pl:[-10,28,30]}, rA:{s:[-10,6,0], e:25}, lA:{s:[20,6,0], e:25}},
      lP:{root:[0,94,5], pel:[10,0,0], lL:{pl:[10,18,44]}, rA:{s:[25,6,0], e:25}, lA:{s:[-15,6,0], e:25}},
      lL:{root:[0,94.6,2], pel:[5,0,0], lL:{pl:[10,30,28]}, rA:{s:[25,6,0], e:25}, lA:{s:[-15,6,0], e:25}},
    },
    seq:[['s0',0.25],['rL',0.25],['rP',0.2],['lHi',0.3],['top',0.2],['rHi',0.25],['lP',0.3],['lL',0.2],['s0',0.25],
         ['lL',0.25],['lP',0.2],['rHi',0.3],['top',0.2],['lHi',0.25],['rP',0.3],['rL',0.2]],
  };
})();

// ---------- Fast march ----------
M['Fast march'] = {
  hl:['rThigh','lThigh'],
  base:P.stand(),
  poses:{
    mid:{lA:{s:[5,8,0], e:80}, rA:{s:[5,8,0], e:80}},
    r:{rL:{pl:[-10,37,51], hl:25}, lA:{s:[45,8,0], e:85}, rA:{s:[-35,8,0], e:80}},
    l:{lL:{pl:[10,37,51], hl:25}, rA:{s:[45,8,0], e:85}, lA:{s:[-35,8,0], e:80}},
  },
  seq:[['mid',0.18],['r',0.2],['mid',0.18],['l',0.2]],
};

// ---------- Standing quad stretch ----------
M['Standing quad stretch'] = {
  props:[{box:[-40,40,0,190,52,57], k:'wall', noFit:true}],
  hl:['rThigh'],
  base:{root:[4,94.6,0], pel:[0,0,0], sp:[0,0,0], nk:[0,0],
    lL:{pl:[8,0,13]}, rL:{h:[-5,0,0], k:150, a:-30},
    lA:{ik:[16,122,50], pole:[0.4,-1,-0.5]}, rA:{ik:[-7,95,-27], pole:[-0.5,-0.5,-1]}},
  poses:{
    hold:{},
    tuck:{pel:[-6,0,0], sp:[6,0,0], rL:{h:[-9,0,0], k:150, a:-30}, rA:{ik:[-7,94,-26], pole:[-0.5,-0.5,-1]}},
  },
  seq:[['hold',2],['tuck',2]],
};

// ---------- Single-leg balance, eyes busy ----------
M['Single-leg balance, eyes busy'] = {
  cam:{yaw:35, pitch:6},
  hl:['rFoot','rToes'],
  base:{root:[-4,94.6,0], pel:[0,0,0], sp:[0,0,0], nk:[0,0],
    rL:{pl:[-8,0,13]}, lL:{pl:[12,16,6], hl:15},
    lA:{s:[5,18,0], e:15}, rA:{s:[5,18,0], e:15}},
  poses:{
    R:{nk:[0,-50], ch:[0,0,-8]},
    L:{nk:[0,50], ch:[0,0,8]},
  },
  seq:[['R',2.5],['L',2.5]],
};

// ---------- Hip circles & leg swings ----------
M['Hip circles & leg swings'] = {
  cam:{yaw:60, pitch:8},
  props:[{box:[42,47,0,190,-25,30], k:'wall', noFit:true}],
  hl:['hips','rThigh'],
  base:{root:[3,94.6,0], pel:[0,0,0], sp:[0,0,0], nk:[0,0],
    lL:{pl:[8,0,13]}, rL:{h:[4,2,0], k:36, a:10},
    lA:{ik:[40,112,8], pole:[0.5,-1,-0.5]}, rA:{s:[10,15,0], e:20}},
  poses:{
    n:{},
    c1:{rL:{h:[70,0,0], k:90, a:0}},
    c2:{rL:{h:[60,40,30], k:90, a:0}},
    c3:{rL:{h:[30,50,30], k:90, a:0}},
    c4:{rL:{h:[-5,25,15], k:60, a:0}},
    fwd:{rL:{h:[50,0,0], k:35, a:15}},
    back:{rL:{h:[-25,0,0], k:50, a:5}},
  },
  seq:[['n',0.4],['c1',0.7],['c2',0.5,'lin'],['c3',0.5,'lin'],['c4',0.5,'lin'],['n',0.4],
       ['fwd',0.6],['back',0.8],['fwd',0.8],['back',0.8],['n',0.6]],
};

// ---------- Lateral band walk ----------
(function(){
  const base={root:[0,76,0], pel:[25,0,0], sp:[-4,0,0], nk:[-12,0],
    rL:{pl:[-13,0,16], pole:[-0.35,0,1]}, lL:{pl:[13,0,16], pole:[0.35,0,1]},
    rA:{ik:[-19,87,6], pole:[-1,0,-0.5]}, lA:{ik:[19,87,6], pole:[1,0,-0.5]}};
  const pose=(rx, r, l, ry, ly)=>({root:[rx,76,0], rL:{pl:[r,ry||0,16], pole:[-0.35,0,1]}, lL:{pl:[l,ly||0,16], pole:[0.35,0,1]},
    rA:{ik:[rx-19,87,6], pole:[-1,0,-0.5]}, lA:{ik:[rx+19,87,6], pole:[1,0,-0.5]}});
  const o=18; // shift so the walk is centred
  M['Lateral band walk'] = {
    cam:{yaw:15, pitch:6},
    att:[{kind:'band', a:'lKnee', b:'rKnee', chain:'rLeg'}],
    hl:['hips'],
    base:base,
    poses:{
      a0:pose(0+o,-13+o,13+o),
      a0r:pose(-5+o,-22+o,13+o,6,0),
      a0w:pose(-9+o,-31+o,13+o),
      a1l:pose(-13+o,-31+o,4+o,0,6),
      a1:pose(-18+o,-31+o,-5+o),
      a1r:pose(-23+o,-40+o,-5+o,6,0),
      a1w:pose(-27+o,-49+o,-5+o),
      a2l:pose(-31+o,-49+o,-14+o,0,6),
      a2:pose(-36+o,-49+o,-23+o),
    },
    seq:[['a0',0.35],['a0r',0.35],['a0w',0.35],['a1l',0.35],['a1',0.35],['a1r',0.35],['a1w',0.35],['a2l',0.35],['a2',0.35],
         ['a2',0.3],['a2l',0.35],['a1w',0.35],['a1r',0.35],['a1',0.35],['a1l',0.35],['a0w',0.35],['a0r',0.35],['a0',0.35]],
  };
})();

// ---------- Standing hip hike ----------
(function(){
  const Y=112.2, D=Math.PI/180;
  const at=r=>({root:[-9+9*Math.cos(r*D), Y+9*Math.sin(r*D), 0], pel:[0,r,0], sp:[0,-0.8*r,0], lL:{h:[0,-r,0], k:10, a:0}});
  M['Standing hip hike'] = {
    cam:{yaw:15, pitch:6},
    props:[{box:[-30,1,0,18,-40,40]}],
    hl:['hips'],
    base:{root:[0,Y,0], pel:[0,0,0], sp:[0,0,0], nk:[0,0],
      rL:{pl:[-9,18,13]}, lL:{h:[0,0,0], k:10, a:0},
      lA:{s:[0,12,0], e:12}, rA:{s:[0,12,0], e:12}},
    poses:{ level:at(0), drop:at(-13), hike:at(13) },
    seq:[['level',0.8],['drop',2],['hike',2],['level',0.8]],
  };
})();

})(window.MOVES, window.POSE);

/* ---- b ---- */
/* Calf ladder, big-toe ladder and toe/knee drills (part b). */
(function(M,P){
const C=o=>JSON.parse(JSON.stringify(o));
const WALL={box:[-40,40,0,190,40,46], k:'wall', noFit:true};
const wallHands={lA:{ik:[16,120,38], pole:[0.4,-1,-0.5]}, rA:{ik:[-16,120,38], pole:[-0.4,-1,-0.5]}};
// left foot lifted behind (single-leg work on the right)
const lUp={h:[-12,0,0], k:80, a:-20};
// bottom stair (ball of the right foot on its back edge) + a second stair + rail on the far (left) side
const STAIRS=[{box:[-40,40,0,18,9,37]},{box:[-40,40,0,36,37,65]},{cyl:[[32,83,-25],[32,138,60]], r:1.8}];
// chair: seat 45 high, back behind the pelvis
const CHAIR=[{box:[-22,22,0,45,-24,18]},{box:[-22,22,45,95,-28,-23]}];
const seated=()=>({root:[0,54,0], pel:[0,0,0], sp:[0,0,0], nk:[0,0],
  lL:{pl:[10,0,58]}, rL:{pl:[-10,0,58]},
  lA:{ik:[24,50,6], pole:[1,0,-1], hd:[0,-1,0.3]}, rA:{ik:[-24,50,6], pole:[-1,0,-1], hd:[0,-1,0.3]}});

// ---------------- Calf ladder ----------------
M['Single-leg calf raises'] = {
  props:[WALL],
  hl:['rShin'],
  base:Object.assign(P.stand(), C(wallHands), {root:[-2,94.4,1], rL:{pl:[-9,0,13]}, lL:C(lUp)}),
  poses:{ down:{}, up:{root:[-2,101,4], rL:{hl:34}} },
  seq:[['down',1],['up',2],['up',1],['down',3]],
};

const stepBase=()=>Object.assign(P.stand(), {root:[-2,112,1], rL:{pl:[-9,18,13]}, lL:C(lUp),
  lA:{ik:[30,115,16], pole:[1,-0.6,-0.5]}, rA:{s:[4,6,0], e:12}});
const stepPoses={ bottom:{root:[-2,106.5,-1], rL:{hl:-22}}, up:{root:[-2,119,4], rL:{hl:34}} };

M['Single-leg raises off a step'] = {
  props:STAIRS,
  hl:['rShin'],
  base:stepBase(),
  poses:C(stepPoses),
  seq:[['bottom',1],['up',2],['up',1],['bottom',3]],
};

M['Weighted single-leg raises'] = {
  props:STAIRS,
  att:[{kind:'kb', at:'rWr', chain:'rArm'}],
  hl:['rShin'],
  base:Object.assign(stepBase(), {rA:{s:[2,8,0], e:4}}),
  poses:C(stepPoses),
  seq:[['bottom',1],['up',2],['up',1],['bottom',3]],
};

M['Heavy single-leg raises'] = {
  props:STAIRS,
  att:[{kind:'kb', at:'rWr', chain:'rArm'}],
  hl:['rShin'],
  base:Object.assign(stepBase(), {rA:{s:[0,10,0], e:2}, sp:[0,-3,0]}),
  poses:C(stepPoses),
  seq:[['bottom',1.2],['up',2.5],['up',1],['bottom',3]],
};

// ---------------- Big-toe ladder ----------------
M['Seated toe-bend raise'] = {
  props:CHAIR,
  hl:['rToes','lToes'],
  base:Object.assign(seated(), {pel:[8,0,0], nk:[10,0],
    lA:{ik:[12,62,36], pole:[1,0,-1], hd:[0,-0.6,1]}, rA:{ik:[-12,62,36], pole:[-1,0,-1], hd:[0,-0.6,1]}}),
  poses:{ down:{}, up:{lL:{hl:38}, rL:{hl:38}, lA:{ik:[12,67,37]}, rA:{ik:[-12,67,37]}} },
  seq:[['down',1],['up',2],['up',1],['down',3]],
  zoom:[-15,85,-86,2], pad:4,
};

const ROLL={cyl:[[-16,3.3,18.5],[16,3.3,18.5]], r:3.3, k:'towel', front:true};
M['Towel-roll heel raise'] = {
  cam:{yaw:90, pitch:2},
  props:[WALL, ROLL],
  hl:['rToes','rShin'],
  base:Object.assign(P.stand(), C(wallHands), {lL:{pl:[10,1.5,13], hl:-5, tu:50}, rL:{pl:[-10,1.5,13], hl:-5, tu:50}}),
  poses:{ down:{}, up:{root:[0,101.5,4], lL:{hl:34}, rL:{hl:34}} },
  seq:[['down',1],['up',2],['up',1],['down',3]],
  zoom:[-30,48,-66,3], pad:4,
};

M['Single-leg towel-roll raise'] = {
  cam:{yaw:90, pitch:2},
  props:[WALL, ROLL],
  hl:['rToes','rShin'],
  base:Object.assign(P.stand(), C(wallHands), {root:[-2,94,1], lL:C(lUp), rL:{pl:[-9,1.5,13], hl:-5, tu:50}}),
  poses:{ down:{}, up:{root:[-2,101.5,4], rL:{hl:34}} },
  seq:[['down',1],['up',2],['up',1],['down',3]],
  zoom:[-30,48,-66,3], pad:4,
};

M['Supported toe-tuck rocks'] = {
  cam:{yaw:90, pitch:8},
  props:[{box:[-26,26,0,4,-14,12], k:'soft'}, {box:[-55,55,0,42,40,95], k:'soft'}, {box:[-55,55,42,80,80,95], k:'soft'}],
  hl:['rToes'],
  base:{root:[0,51,-15], pel:[45,0,0], sp:[0,0,0], nk:[-15,0],
    lL:{ik:[10,15,-42.7], pole:[0,-0.2,1], a:0, t:85}, rL:{ik:[-10,15,-42.7], pole:[0,-0.2,1], a:0, t:85},
    lA:{ik:[17,47,47], pole:[0.3,-1,-0.3], hd:[0,-0.3,1]}, rA:{ik:[-17,47,47], pole:[-0.3,-1,-0.3], hd:[0,-0.3,1]}},
  poses:{ fwd:{}, back:{root:[0,41,-31], pel:[52,0,0]} },
  seq:[['fwd',1],['back',2],['back',0.6],['fwd',2]],
};

M['Pogo hops'] = {
  hl:['rShin','lShin'],
  base:Object.assign(P.stand(), {root:[0,96,1], lL:{pl:[10,0,13], hl:18}, rL:{pl:[-10,0,13], hl:18},
    lA:{s:[6,10,0], e:28}, rA:{s:[6,10,0], e:28}}),
  poses:{ land:{}, air:{root:[0,104,2], lL:{pl:[10,4.5,13], hl:32}, rL:{pl:[-10,4.5,13], hl:32}, lA:{s:[2,12,0], e:22}, rA:{s:[2,12,0], e:22}} },
  seq:[['land',0.2,'in'],['air',0.22,'out']],
};

M['Skipping'] = {
  hl:['rToes','rShin'],
  base:Object.assign(P.stand(), {root:[0,97,2], lL:{pl:[10,0,13], hl:22}, rL:{pl:[-10,0,13], hl:22},
    lA:{s:[10,30,0], e:35}, rA:{s:[10,30,0], e:35}}),
  poses:{
    r:{root:[0,97,2], rL:{pl:[-10,0,14], hl:22}, lL:{pl:[10,9,10], hl:40}},
    up1:{root:[0,102,2], rL:{pl:[-10,4,14], hl:34}, lL:{pl:[10,6,12], hl:36}, lA:{s:[12,34,0], e:40}, rA:{s:[12,34,0], e:40}},
    l:{root:[0,97,2], lL:{pl:[10,0,14], hl:22}, rL:{pl:[-10,9,10], hl:40}},
    up2:{root:[0,102,2], lL:{pl:[10,4,14], hl:34}, rL:{pl:[-10,6,12], hl:36}, lA:{s:[12,34,0], e:40}, rA:{s:[12,34,0], e:40}},
  },
  seq:[['r',0.18,'in'],['up1',0.18,'out'],['l',0.18,'in'],['up2',0.18,'out']],
};

M['Strides prep'] = {
  hl:['rToes','rShin'],
  base:Object.assign(P.stand(), {root:[0,97,2], pel:[4,0,0], lL:{pl:[10,0,14], hl:22}, rL:{pl:[-10,0,14], hl:22},
    lA:{s:[0,6,0], e:80}, rA:{s:[0,6,0], e:80}}),
  poses:{
    r:{root:[0,97,2], rL:{pl:[-10,0,14], hl:22}, lL:{pl:[10,34,32], hl:-8}, lA:{s:[-35,6,0], e:80}, rA:{s:[40,6,0], e:80}},
    up1:{root:[0,103,4], rL:{pl:[-10,5,12], hl:38}, lL:{pl:[10,22,28], hl:0}},
    l:{root:[0,97,2], lL:{pl:[10,0,14], hl:22}, rL:{pl:[-10,34,32], hl:-8}, rA:{s:[-35,6,0], e:80}, lA:{s:[40,6,0], e:80}},
    up2:{root:[0,103,4], lL:{pl:[10,5,12], hl:38}, rL:{pl:[-10,22,28], hl:0}},
  },
  seq:[['r',0.25],['up1',0.2],['l',0.25],['up2',0.2]],
};

// ---------------- Toe rehab drills ----------------
M['Big-toe mobility'] = {
  // sitting on the floor, right knee up, heel down and forefoot free; the hand bends the big toe
  hl:['rToes'],
  base:{root:[0,9,0], pel:[18,0,0], sp:[10,0,0], ch:[8,0,0], nk:[20,0],
    lL:{h:[74,4,0], k:0, a:10}, rL:{pl:[-10,7,44], hl:-22, tu:-13, pole:[0,1,0.1]},
    lA:{ik:[24,4,8], pole:[1,0,-1], hd:[0,-0.6,0.8]},
    rA:{ik:[-10,10.5,57], pole:[-1,0,-0.6], hd:[0,-0.4,-1]}},
  poses:{ down:{}, up:{rL:{tu:82}, rA:{ik:[-10,20,51], hd:[0,-0.7,-0.7]}} },
  seq:[['down',1.2],['up',1.2]],
  zoom:[-25,75,-88,3], pad:4,
};

M['Short foot (seated)'] = {
  props:CHAIR,
  hl:['rFoot'],
  base:Object.assign(seated(), {lA:{ik:[12,58,34], pole:[1,0,-1], hd:[0,-0.6,1]}, rA:{ik:[-12,58,34], pole:[-1,0,-1], hd:[0,-0.6,1]}}),
  poses:{ relax:{}, arch:{rL:{hl:6}} },
  seq:[['relax',1],['arch',1],['arch',5],['relax',1]],
  zoom:[20,80,-50,3], pad:4,
};

M['Big-toe press'] = {
  props:[],
  hl:['rToes','lToes'],
  base:Object.assign(P.stand(), {lL:{pl:[10,0,13], tu:14}, rL:{pl:[-10,0,13], tu:14}}),
  poses:{ relax:{}, press:{root:[0,94.4,4], lL:{tu:-4}, rL:{tu:-4}} },
  seq:[['relax',1.2],['press',0.8],['press',5],['relax',0.8]],
  zoom:[-25,40,-60,3], pad:4,
};

// ---------------- Knee rehab / cool-down ----------------
M['Seated knee extension'] = {
  props:CHAIR,
  att:[{kind:'cuff', at:'rAnk', chain:'rLeg'}],
  hl:['rThigh'],
  base:Object.assign(seated(), {rL:{h:[88,0,0], k:90, a:0}}),
  poses:{ down:{}, up:{rL:{k:45, a:5}} },
  seq:[['down',1],['up',2],['up',0.5],['down',3]],
};

M['Wall calf stretch'] = {
  props:[{box:[-40,40,0,190,64,70], k:'wall', noFit:true}],
  hl:['rShin'],
  base:{root:[0,79.5,0], pel:[25,0,0], sp:[0,0,0], nk:[-12,0],
    lL:{pl:[10,0,36]}, rL:{pl:[-10,0,-36]},
    lA:{ik:[17,124,62], pole:[0.5,-1,-0.3], hd:[0,1,0.2]}, rA:{ik:[-17,124,62], pole:[-0.5,-1,-0.3], hd:[0,1,0.2]}},
  poses:{
    straight:{root:[0,79.5,-4]},
    lean:{root:[0,79.5,0], pel:[27,0,0]},
    bent:{root:[0,70,-4], pel:[22,0,0], lA:{ik:[17,118,62]}, rA:{ik:[-17,118,62]}},
  },
  seq:[['straight',1.5],['lean',1.5],['lean',1.5],['straight',1.2],['bent',1.5],['bent',1.5]],
};
})(window.MOVES, window.POSE);

/* ---- c ---- */
(function(M,P){
const clone=o=>JSON.parse(JSON.stringify(o));
const lie=()=>P.hookLying();
// rotate a pelvis-relative offset v by pelvis pitch p (deg) and add root
const rx=(root,p,v)=>{ const c=Math.cos(p*Math.PI/180), s=Math.sin(p*Math.PI/180); return [root[0]+v[0], root[1]+v[1]*c-v[2]*s, root[2]+v[1]*s+v[2]*c]; };

// ---------- bridges ----------
const hug=(y,z)=>({lA:{ik:[12,y,z], pole:[1,0,0], hd:[0,-0.2,1]}, rA:{ik:[3,y,z], pole:[-1,0,0], hd:[0,-0.2,1]}});
M['Single-leg glute bridge'] = {
  hl:['rThigh','hips'],
  base:Object.assign(lie(), {lL:{h:[125,0,0], k:125, a:-10}}, hug(51,-22)),
  poses:{
    down:{},
    up:Object.assign({root:[0,33,0], pel:[-118,0,0], nk:[38,0], lL:{h:[122,0,0], k:130, a:-10}}, hug(59,-35)),
  },
  seq:[['down',1],['up',1.2],['up',1],['down',1.6]],
};

M['Feet-elevated single-leg bridge'] = {
  props:[{box:[-40,40,0,20,32,66]}],
  hl:['rThigh','hips'],
  base:Object.assign(lie(), {rL:{pl:[-10,20,58], pole:[0,0,1]}, lL:{h:[125,0,0], k:125, a:-10}}, hug(51,-22)),
  poses:{
    down:{},
    up:Object.assign({root:[0,40,0], pel:[-122,0,0], nk:[40,0], lL:{h:[122,0,0], k:130, a:-10}}, hug(63,-36.5)),
  },
  seq:[['down',1],['up',1.3],['up',2],['down',1.6]],
};

M['Long-lever bridge'] = {
  hl:['rThigh','lThigh'],
  base:Object.assign(lie(), {lL:{pl:[10,15,98], hl:-40, pole:[0,0,1]}, rL:{pl:[-10,15,98], hl:-40, pole:[0,0,1]}}),
  poses:{
    down:{},
    up:{root:[0,32,0], pel:[-112,0,0], nk:[36,0]},
  },
  seq:[['down',1],['up',1.3],['up',2],['down',1.5]],
};

M['Glute bridges (easy)'] = {
  hl:['rThigh','lThigh'],
  base: lie(),
  poses:{ down:{}, up:{root:[0,36,0], pel:[-122,0,0], nk:[40,0]} },
  seq:[['down',0.6],['up',1.1],['up',1],['down',1.2]],
};

M['Glute bridge march'] = {
  hl:['rThigh','lThigh'],
  base:Object.assign(lie(), {root:[0,36,0], pel:[-122,0,0], nk:[40,0]}),
  poses:{
    up:{},
    rUp:{rL:{pl:[-10,21,43]}},
    lUp:{lL:{pl:[10,21,43]}},
  },
  seq:[['up',0.5],['rUp',0.9],['up',0.9],['up',0.4],['lUp',0.9],['up',0.9]],
};

// ---------- slider curls (heels on a towel, toes up) ----------
const heel=(x,z)=>({pl:[x,14.4,z], hl:-30, pole:[0,0,1]});
M['Slider curl (two legs)'] = {
  hl:['rThigh','lThigh'],
  att:[{kind:'towel', at:'rHeel', chain:'rLeg'},{kind:'towel', at:'lHeel', chain:'lLeg'}],
  base:Object.assign(lie(), {lL:heel(10,56), rL:heel(-10,56)}),
  poses:{
    down:{},
    up:{root:[0,34,0], pel:[-118,0,0], nk:[38,0]},
    out:{root:[0,29,0], pel:[-107,0,0], nk:[34,0], lL:heel(10,100), rL:heel(-10,100)},
  },
  seq:[['down',1],['up',1.2],['out',4],['up',1.6],['down',1.2]],
};

M['Eccentric-only slider curl'] = {
  hl:['rThigh','lThigh'],
  att:[{kind:'towel', at:'rHeel', chain:'rLeg'},{kind:'towel', at:'lHeel', chain:'lLeg'}],
  base:Object.assign(lie(), {lL:heel(10,56), rL:heel(-10,56)}),
  poses:{
    in:{},
    up:{root:[0,34,0], pel:[-118,0,0], nk:[38,0]},
    out:{root:[0,20,0], pel:[-99,0,0], nk:[30,0], lL:heel(10,102), rL:heel(-10,102)},
    flat:{root:[0,11,0], pel:[-90,0,0], nk:[18,0], lL:heel(10,102), rL:heel(-10,102)},
  },
  seq:[['in',1.4],['up',1.1],['out',5],['flat',0.7]],
};

M['Single-leg slider curl'] = {
  hl:['rThigh'],
  att:[{kind:'towel', at:'rHeel', chain:'rLeg'}],
  base:Object.assign(lie(), {rL:heel(-10,56), lL:{h:[80,0,0], k:8, a:10}}),
  poses:{
    down:{},
    up:{root:[0,32,0], pel:[-116,0,0], nk:[38,0], lL:{h:[60,0,0], k:8, a:10}},
    out:{root:[0,22,0], pel:[-100,0,0], nk:[32,0], rL:heel(-10,98), lL:{h:[72,0,0], k:8, a:10}},
  },
  seq:[['down',1],['up',1.2],['out',3.5],['up',2],['down',1.2]],
};

// ---------- core ----------
M['McGill curl-up'] = {
  hl:['chest','lumbar'],
  base:Object.assign(lie(), {lL:{h:[-4,0,0], k:0, a:-12},
    lA:{ik:[7,2,-12], pole:[1,0,0]}, rA:{ik:[-7,2,-12], pole:[-1,0,0]}}),
  poses:{ down:{}, up:{ch:[17,0,0], nk:[16,0]} },
  seq:[['down',1],['up',1.2],['up',8],['down',1.2]],
};

M['Dead bug'] = {
  hl:['lumbar'],
  base:Object.assign(lie(), {nk:[18,0], lL:{h:[90,0,0], k:90, a:0}, rL:{h:[90,0,0], k:90, a:0},
    lA:{s:[90,0,0], e:0}, rA:{s:[90,0,0], e:0}}),
  poses:{
    start:{},
    a:{rA:{s:[168,0,0], e:0}, lL:{h:[12,0,0], k:4, a:0}},
    b:{lA:{s:[168,0,0], e:0}, rL:{h:[12,0,0], k:4, a:0}},
  },
  seq:[['start',1.5],['a',3],['start',1.5],['b',3]],
};

// ---------- stretches ----------
M['Hamstring floss'] = {
  hl:['rThigh'],
  base:Object.assign(lie(), {rL:{h:[105,0,0], k:95, a:5},
    lA:{ik:[-3,30,0], pole:[1,0.3,0]}, rA:{ik:[-12,30,0], pole:[-1,0.3,0]}}),
  poses:{ bent:{}, straight:{rL:{h:[105,0,0], k:6, a:20}} },
  seq:[['bent',0.6],['straight',2.5],['straight',0.6],['bent',2]],
};

// Figure-4: right ankle crossed over the left thigh, hands behind the left thigh (lying, hips at [0,11,0])
function fig4(f){
  const D=Math.PI/180, u=[Math.cos(f*D), Math.sin(f*D)], ant=[Math.cos((f+90)*D), Math.sin((f+90)*D)], post=[-ant[0],-ant[1]];
  const at=(t,off,n)=>[11+t*44*u[1]+off*n[1], t*44*u[0]+off*n[0]]; // [y,z] along the left thigh
  const ank=at(0.86,7.5,ant), hnd=at(0.6,6,post);
  return {lL:{h:[f,0,0], k:f, a:5}, rL:{ik:[11,ank[0],ank[1]], pole:[-1,-0.4,-0.5], a:15},
    lA:{ik:[16,hnd[0],hnd[1]], pole:[1,-0.3,0]}, rA:{ik:[-26,3,-6], pole:[-1,0,0]}};
}
M['Figure-4 stretch'] = {
  cam:{yaw:55, pitch:20},
  hl:['hips'],
  base:Object.assign(lie(), fig4(100)),
  poses:{ ease:{}, draw:Object.assign({nk:[24,0]}, fig4(122)) },
  seq:[['ease',1.2],['draw',2.5],['draw',1],['ease',2.5]],
};

M['Supine twist'] = {
  cam:{yaw:90, pitch:40},
  hl:['lumbar'],
  base:{root:[0,11,0], pel:[-90,-90,90], sp:[0,0,0], ch:[0,0,0], nk:[15,0],
    lL:{h:[85,0,0], k:95, a:0}, rL:{h:[85,0,0], k:95, a:0},
    lA:{s:[-12,85,0], e:5}, rA:{s:[-12,85,0], e:5}},
  poses:{
    mid:{},
    drop:{root:[0,13,0], pel:[-165,-90,90], sp:[0,0,32], ch:[0,0,36], nk:[15,-25], rA:{s:[-4,85,0], e:5}},
    deep:{root:[0,13,0], pel:[-172,-90,90], sp:[0,0,35], ch:[0,0,39], nk:[15,-25], rA:{s:[-4,85,0], e:5}},
  },
  seq:[['mid',1.5],['drop',2.5],['deep',2],['drop',2]],
};

M['Legs up the wall'] = {
  props:[{box:[-50,50,0,170,9,26], k:'wall', noFit:true}],
  hl:[],
  base:Object.assign(lie(), {lL:{h:[88,0,0], k:4, a:5}, rL:{h:[88,0,0], k:4, a:5},
    lA:{s:[-10,50,0], e:12}, rA:{s:[-10,50,0], e:12}}),
  poses:{ exhale:{}, inhale:{ch:[-4,0,0], nk:[14,0], lA:{s:[-10,54,0], e:12}, rA:{s:[-10,54,0], e:12}} },
  seq:[['exhale',3],['inhale',2.5]],
};

// ---------- hinges ----------
// hands hold the stick: right hand behind the neck, left hand at the low back (offsets from the pelvis, rotated with the hinge)
const stickArms=(root,p)=>({rA:{ik:rx(root,p,[-5,50,-14]), pole:[-1,0.6,-0.3]}, lA:{ik:rx(root,p,[6,12,-17]), pole:[1,0,-0.3]}});
M['Broomstick hinge'] = {
  hl:['rThigh','lThigh'],
  att:[{kind:'stick', a:'head', b:'pelvis', off:14, ext:12, chain:'torso'}],
  base:Object.assign(P.stand(), stickArms([0,94.6,0],0)),
  poses:{ up:{}, down:Object.assign({root:[0,90,-17], pel:[58,0,0]}, stickArms([0,90,-17],58)) },
  seq:[['up',1],['down',2],['down',0.5],['up',1.5]],
};

M['Single-leg RDL reach'] = {
  hl:['rThigh'],
  base:Object.assign(P.stand(), {rL:{pl:[-8,0,12]}, lL:{h:[0,0,0], k:2, a:0}}),
  poses:{
    up:{},
    down:{root:[0,86,-8], pel:[82,0,0], nk:[-15,0], lL:{h:[-2,0,0], k:4, a:0},
      lA:{s:[70,6,0], e:5}, rA:{s:[70,6,0], e:5}},
  },
  seq:[['up',1],['down',2.2],['down',0.5],['up',1.8]],
};
M['Tempo single-leg RDL'] = Object.assign(clone(M['Single-leg RDL reach']), {
  seq:[['up',1],['down',4],['down',1],['up',1.8]],
});

})(window.MOVES, window.POSE);

/* ---- d ---- */
(function(M,P){
const clone=o=>JSON.parse(JSON.stringify(o));
const as=(...o)=>Object.assign({},...o);

/* ---------- push-up family ----------
   Toes pinned (ball of the foot), legs FK straight, hands IK on a surface.
   q = world angle of the foot (heel→ball) below the forward direction; a = pitch − q keeps it
   constant while the body pitch changes, t = q lays the toes flat. */
function pushLegs(p, q){ const L={h:[0,2,0], k:0, a:p-q, t:q}; return {lL:clone(L), rL:clone(L)}; }
function pushArm(s, y, z, x){ return {ik:[s*(x||17), y, z], pole:[s*0.7,-1,0], hd:[0,0,1]}; }
function pushup(o){
  const q=o.q||80;
  return {
    cam:o.cam, props:o.props||[], hl:o.hl||['rUpper','lUpper','chest'],
    base:as({pel:[o.up,0,0], sp:[0,0,0], nk:o.nk||[-8,0], pin:{j:'rBall', at:[-12, (o.fy||0)+2, 0]},
      lA:pushArm(1,o.hy,o.hz), rA:pushArm(-1,o.hy,o.hz)}, pushLegs(o.up,q)),
    poses:{ up:{}, down:as({pel:[o.dn,0,0]}, pushLegs(o.dn,q)) },
    seq:o.seq||[['up',1],['down',2],['up',1.2]],
  };
}

// hands on a counter (~90cm)
M['Incline push-up'] = pushup({up:37, dn:51, q:50, hy:93, hz:116,
  props:[{box:[-55,55,0,90,112,172]}], seq:[['up',1],['down',2],['up',1.2]]});
// hands on a sofa arm (~55cm), 3s down
M['Low-incline push-up'] = pushup({up:53, dn:63, q:60, hy:58, hz:130,
  props:[{box:[-50,50,0,55,126,150], k:'soft'}, {box:[-50,50,0,42,150,200], k:'soft'}], seq:[['up',1],['down',3],['up',1.2]]});
// feet on the sofa seat (42cm)
M['Decline push-up'] = pushup({up:92, dn:103, q:80, fy:42, hy:3, hz:136, nk:[-4,0],
  props:[{box:[-45,45,0,42,-60,8], k:'soft'}], seq:[['up',1],['down',2],['up',1.2]]});

/* Archer: wide hands, body shifts over the bending right arm, left arm stays long */
(function(){
  const q=80, up=76, dn=88;
  M['Archer push-up'] = {
    cam:{yaw:14, pitch:12},
    hl:['rUpper','rFore','chest'],
    base:as({pel:[up,0,0], sp:[0,0,0], nk:[-8,0], pin:{j:'rBall', at:[-12,2,-125]},
      lA:{ik:[40,3,3], pole:[0.4,-1,0.2], hd:[0.3,0,1]}, rA:{ik:[-42,3,3], pole:[-0.6,-1,0], hd:[-0.3,0,1]}}, pushLegs(up,q)),
    poses:{ up:{}, down:as({pel:[dn,0,-13], sp:[0,-4,0], lA:{ik:[40,3,3], pole:[0.4,-1,0.2], hd:[0.3,0,1]}}, pushLegs(dn,q)) },
    seq:[['up',1],['down',2],['up',1.2]],
  };
})();

/* ---------- Prone Y-W-T (seen from above) ---------- */
(function(){
  const lie={root:[0,12,0], pel:[90,0,0], sp:[0,0,0], nk:[4,0],
    lL:{h:[5,2,0], k:0, a:-75}, rL:{h:[5,2,0], k:0, a:-75}};
  const Y=(y)=>({lA:{ik:[53,y,81], hd:[0.4,0.4,1]}, rA:{ik:[-53,y,81], hd:[-0.4,0.4,1]}});
  M['Prone Y-W-T'] = {
    cam:{yaw:90, pitch:60},
    hl:['shoulders','chest'],
    base:as(lie, Y(5)),
    poses:{
      rest:{},
      y:as(Y(18), {ch:[-3,0,0]}),
      w:{ch:[-3,0,0], lA:{ik:[34,20,52], pole:[1,-1,-0.4], hd:[0,0.5,1]}, rA:{ik:[-34,20,52], pole:[-1,-1,-0.4], hd:[0,0.5,1]}},
      t:{ch:[-3,0,0], lA:{ik:[68,19,44], hd:[1,0.3,0]}, rA:{ik:[-68,19,44], hd:[-1,0.3,0]}},
    },
    seq:[['rest',1],['y',1],['y',1],['w',1.2],['w',1],['t',1.2],['t',1],['rest',1.2]],
  };
})();

/* ---------- Doorframe rows: lean back, row chest to the frame ---------- */
(function(){
  const lean=(th)=>{ const r=th*Math.PI/180; return {root:[0, 8+86.5*Math.cos(r), 31-86.5*Math.sin(r)], pel:[-th,0,0]}; };
  const grip=(s)=>({ik:[s*33,124,20], pole:[s*0.6,-0.6,-1]});
  M['Doorframe rows'] = {
    cam:{yaw:72, pitch:8},
    props:[{box:[-41,-35,0,205,20,30], k:'wall', noFit:true}, {box:[35,41,0,205,20,30], k:'wall', noFit:true}],
    hl:['shoulders','rUpper','lUpper'],
    base:as(P.stand(), lean(27), {nk:[8,0], lL:{pl:[10,0,45]}, rL:{pl:[-10,0,45]}, lA:grip(1), rA:grip(-1)}),
    poses:{ out:{}, row:as(lean(12), {nk:[2,0]}) },
    seq:[['out',2],['row',1.2],['row',2],['out',2]],
  };
})();

/* ---------- Towel table rows: under a table, pull the chest to the edge ---------- */
(function(){
  const legs=(p)=>({lL:{h:[0,3,0], k:0, a:p+80}, rL:{h:[0,3,0], k:0, a:p+80}});
  const Ze=-128;
  const grip=(s)=>({ik:[s*24,64,Ze+2], pole:[s*0.6,0,-1], hd:[0,1,0.4]});
  M['Towel table rows'] = {
    props:[{box:[-60,60,68,72,Ze,Ze+95]}, {box:[-60,-54,0,68,Ze+89,Ze+95]}],
    hl:['shoulders','rUpper','lUpper'],
    base:as({pel:[-84,0,0], sp:[0,0,0], nk:[12,0], pin:{j:'rHeel', at:[-12,3.4,0]}, lA:grip(1), rA:grip(-1)}, legs(-84)),
    poses:{ down:{}, up:as({pel:[-70,0,0], nk:[4,0]}, legs(-70)) },
    seq:[['down',1],['up',1.2],['up',1],['down',3]],
  };
})();

/* ---------- Bird dog ---------- */
(function(){
  const q=as(P.quadruped(), {root:[0,52,-10], pel:[85,0,0],
    lL:{ik:[11,6,-53], pole:[0,0,1], a:-60}, rL:{ik:[-11,6,-53], pole:[0,0,1], a:-60},
    lA:{ik:[17,3,34], pole:[0.3,-1,0], hd:[0,0,1]}, rA:{ik:[-17,3,34], pole:[-0.3,-1,0], hd:[0,0,1]}});
  M['Bird dog'] = {
    hl:['lumbar','hips','lThigh'],
    base:q,
    poses:{
      start:{},
      reach:{pel:[88,0,0], rA:{ik:[-17,60,86], pole:[-0.3,-1,0], hd:[0,0,1]}, lL:{ik:[9,56,-96], pole:[0,0,1], a:0}},
    },
    seq:[['start',1.5],['reach',1.5],['reach',5],['start',1.5]],
  };
})();

/* ---------- Bear-crawl shoulder taps (knees hover) ---------- */
(function(){
  const base={root:[0,54,-14], pel:[87,0,0], sp:[0,0,0], nk:[-12,0],
    lL:{ik:[11,15,-54], pole:[0,0,1], a:-8, t:70}, rL:{ik:[-11,15,-54], pole:[0,0,1], a:-8, t:70},
    lA:{ik:[17,3,31], pole:[0.3,-1,0], hd:[0,0,1]}, rA:{ik:[-17,3,31], pole:[-0.3,-1,0], hd:[0,0,1]}};
  M['Bear-crawl shoulder taps'] = {
    cam:{yaw:28, pitch:8},
    hl:['lumbar','shoulders'],
    base,
    poses:{
      hold:{},
      tapR:{root:[3,54,-14], rA:{ik:[6,62,26], pole:[-0.5,0,1], hd:[1,0.3,0]}},
      tapL:{root:[-3,54,-14], lA:{ik:[-6,62,26], pole:[0.5,0,1], hd:[-1,0.3,0]}},
    },
    seq:[['hold',0.7],['tapR',0.7],['tapR',0.3],['hold',0.7],['tapL',0.7],['tapL',0.3]],
  };
})();

/* ---------- Slow mountain climbers ---------- */
(function(){
  const base={root:[0,40,-2], pel:[74,0,0], sp:[0,0,0], nk:[-10,0],
    lL:{ik:[11,15,-84], pole:[0,0,1], a:-6, t:80}, rL:{ik:[-11,15,-84], pole:[0,0,1], a:-6, t:80},
    lA:{ik:[17,3,43], pole:[0.4,-1,0], hd:[0,0,1]}, rA:{ik:[-17,3,43], pole:[-0.4,-1,0], hd:[0,0,1]}};
  M['Slow mountain climbers'] = {
    hl:['lumbar','rThigh','lThigh'],
    base,
    poses:{
      plank:{},
      rIn:{rL:{ik:[-11,20,-12], pole:[0,0.8,1], a:10, t:30}},
      lIn:{lL:{ik:[11,20,-12], pole:[0,0.8,1], a:10, t:30}},
    },
    seq:[['plank',0.9],['rIn',0.9],['plank',0.9],['lIn',0.9]],
  };
})();

/* ---------- Suitcase carry: slow walk in place, kettlebell in the right hand ---------- */
(function(){
  const b=as(P.stand(), {root:[0,93,2], rA:{s:[0,9,0], e:0}, lA:{s:[0,6,0], e:12}});
  M['Suitcase carry'] = {
    cam:{yaw:32, pitch:6},
    att:[{kind:'kb', at:'rWr', chain:'rArm'}],
    hl:['lumbar','shoulders'],
    base:b,
    poses:{
      r:{root:[0,91.5,6], rL:{pl:[-10,5,34], hl:-15}, lL:{pl:[10,0,-10], hl:35}, lA:{s:[22,6,0], e:18}},
      pl:{root:[0,94,2], rL:{pl:[-10,0,12], hl:0}, lL:{pl:[10,8,10], hl:25}, lA:{s:[4,6,0], e:14}},
      l:{root:[0,91.5,6], lL:{pl:[10,5,34], hl:-15}, rL:{pl:[-10,0,-10], hl:35}, lA:{s:[-18,6,0], e:10}},
      pr:{root:[0,94,2], lL:{pl:[10,0,12], hl:0}, rL:{pl:[-10,8,10], hl:25}, lA:{s:[4,6,0], e:14}},
    },
    seq:[['r',0.6],['pl',0.6],['l',0.6],['pr',0.6]],
  };
})();

/* ---------- Scap push-ups (plank) then big arm circles (standing) ---------- */
(function(){
  const legsIK=(lz,ly,a,t)=>({lL:{ik:[11,ly,lz], pole:[0,0,1], a, t}, rL:{ik:[-11,ly,lz], pole:[0,0,1], a, t}});
  const plank=as({root:[0,40,-2], pel:[74,0,0], sp:[0,0,0], ch:[0,0,0], nk:[-10,0],
    lA:{ik:[17,3,43], pole:[0.4,-1,0], hd:[0,0,1]}, rA:{ik:[-17,3,43], pole:[-0.4,-1,0], hd:[0,0,1]}}, legsIK(-84,15,-6,80));
  // standing arm circle: wrist targets on a circle around the shoulder (sagittal plane)
  const circ=(deg)=>{ const r=deg*Math.PI/180, R=51, sy=139, sz=0;
    const y=sy-R*Math.cos(r), z=sz+R*Math.sin(r);
    return {lA:{ik:[21,y,z], pole:[1,-0.3,-1], hd:[0,-Math.cos(r),Math.sin(r)]}, rA:{ik:[-21,y,z], pole:[-1,-0.3,-1], hd:[0,-Math.cos(r),Math.sin(r)]}}; };
  const stand=as({root:[0,94.6,0], pel:[0,0,0], sp:[0,0,0], ch:[0,0,0], nk:[0,0]}, legsIK(-1,8,0,0));
  M['Scap push-ups + arm circles'] = {
    hl:['shoulders','chest'],
    base:plank,
    poses:{
      spread:{ch:[9,0,0], root:[0,41.5,-2]},
      squeeze:{ch:[-9,0,0], root:[0,38.5,-2]},
      c0:as(stand, circ(10)), c1:as(stand, circ(90)), c2:as(stand, circ(180)), c3:as(stand, circ(270)),
    },
    seq:[['spread',1],['squeeze',1],['spread',1],['squeeze',1],['spread',1],
         ['c0',1.4],['c1',0.9,'lin'],['c2',0.9,'lin'],['c3',0.9,'lin'],['c0',0.9,'lin'],['c1',0.9,'lin'],['c2',0.9,'lin'],['c3',0.9,'lin'],['c0',0.9,'lin'],['spread',1.4]],
  };
})();

/* ---------- Doorway pec stretch (right forearm on the frame) ---------- */
(function(){
  const b=as(P.stand(), {root:[0,93,-10], pel:[3,0,0], nk:[0,0],
    lL:{pl:[10,0,14]}, rL:{pl:[-10,0,-24], hl:20},
    rA:{ik:[-47,161,-4], pole:[-1,-0.6,-0.2], hd:[0,1,0]}, lA:{s:[4,6,0], e:12}});
  M['Doorway pec stretch'] = {
    cam:{yaw:35, pitch:12},
    props:[{box:[-60,-47,0,205,0,12], k:'wall', noFit:true}],
    hl:['rUpper','chest'],
    base:b,
    poses:{ ease:{}, stretch:{root:[0,91,4], pel:[6,0,0]} },
    seq:[['ease',2],['stretch',2.5],['stretch',1.5],['ease',2]],
  };
})();

/* ---------- Side plank family ----------
   Lying on the right side (pel roll ~74), right elbow pinned on the floor directly under the
   shoulder: FK upper arm straight down (abduction = chest roll), elbow 90°, forearm forward. */
function sideArm(roll, side){ return {s:[0,roll+2*(side||0),0], e:90}; }
function sp(roll, side){ return {pel:[0,roll,0], sp:[0,side,0], rA:sideArm(roll,side)}; }
const SP_BASE={sp:[0,0,0], nk:[0,-8], pin:{j:'rElb', at:[0,4.5,0]},
  lL:{h:[0,-7,0], k:0, a:0}, rL:{h:[0,0,0], k:0, a:0}, lA:{s:[2,6,0], e:14}};

M['Side plank'] = {
  cam:{yaw:36, pitch:12},
  hl:['lumbar','hips'],
  base:as(SP_BASE, sp(74,0)),
  poses:{ up:{}, high:sp(72,3.5) },
  seq:[['up',1.5],['high',2],['high',0.8],['up',2]],
};

M['Side plank, knees bent'] = {
  cam:{yaw:36, pitch:12},
  hl:['lumbar','hips'],
  base:as(SP_BASE, sp(66,0), {lL:{h:[0,-6,0], k:90, a:-55}, rL:{h:[0,0,0], k:90, a:-55}}),
  poses:{ up:{}, high:sp(64,3) },
  seq:[['up',1.5],['high',2],['high',0.8],['up',2]],
};

M['Side plank + leg lift'] = {
  cam:{yaw:36, pitch:12},
  hl:['lumbar','hips','lThigh'],
  base:as(SP_BASE, sp(74,0)),
  poses:{ down:{}, lift:{lL:{h:[0,32,0], k:0, a:0}} },
  seq:[['down',1],['lift',2],['lift',0.6],['down',2]],
};

})(window.MOVES, window.POSE);

/* ---- e ---- */
(function(M,P){
const clone=o=>JSON.parse(JSON.stringify(o));

// ---- side-lying base: on the RIGHT side, head toward -x, facing +z (camera from the front)
const sideLie=()=>({root:[0,18,0], pel:[0,90,0], sp:[0,-8,0], ch:[0,4,0], nk:[0,0],
  rA:{ik:[-95,4,8], pole:[0,0,1], hd:[-1,0,0]},
  lA:{ik:[-4,37,8], pole:[1,0,0.3], hd:[1,0,0]}});

M['Clamshell'] = {
  cam:{yaw:15, pitch:25},
  hl:['hips','lThigh'],
  base:Object.assign(sideLie(), {
    rL:{ik:[60,5,2], pole:[0,0,1], a:-20},
    lL:{ik:[60,14,2], pole:[-0.1,0,1], a:-20}}),
  poses:{ closed:{}, open:{lL:{pole:[0.8,0,0.6]}} },
  seq:[['closed',0.6],['open',2],['closed',2]],
};

const sideRaise=()=>({
  cam:{yaw:15, pitch:20},
  hl:['hips','lThigh'],
  base:Object.assign(sideLie(), {
    rL:{h:[40,5,0], k:80, a:-10},
    lL:{h:[-12,-6,0], k:0, a:-10}}),
  poses:{ down:{}, up:{lL:{h:[-12,30,0]}} },
});
M['Side-lying leg raise'] = Object.assign(sideRaise(), {seq:[['down',0.5],['up',1.5],['down',2]]});
M['Side-lying raise, 3s hold'] = Object.assign(sideRaise(), {seq:[['down',0.5],['up',1.5],['up',3],['down',2]]});

M['Side-plank clamshell'] = {
  cam:{yaw:18, pitch:14},
  hl:['hips','lThigh'],
  base:{root:[0,37,0], pel:[0,72,0], sp:[0,0,0], nk:[0,-10],
    rL:{h:[30,15,14], k:95, a:-40},
    lL:{ik:[52,16,-15.7], pole:[-0.1,0,1], a:-40},
    rA:{ik:[-47,3,25], pole:[-0.63,-0.17,-0.76], hd:[0,0,1]}, lA:{ik:[-3,56,8], pole:[1,0,0.3], hd:[1,-0.3,0]}},
  poses:{ closed:{}, open:{lL:{pole:[0.8,0,0.6]}} },
  seq:[['closed',0.6],['open',1.5],['closed',1.5]],
};

M['Side-plank leg raise'] = {
  cam:{yaw:18, pitch:10},
  hl:['hips','lThigh'],
  base:{pel:[0,75,0], sp:[0,0,0], nk:[0,-10], pin:{j:'rAnk', at:[82,8,0]},
    lL:{h:[0,0,0], k:0, a:0}, rL:{h:[0,0,0], k:0, a:0},
    rA:{ik:[-45,3,25], pole:[-0.63,-0.17,-0.76], hd:[0,0,1]}, lA:{ik:[-3,58,8], pole:[1,0,0.3], hd:[1,-0.3,0]}},
  poses:{ down:{}, up:{lL:{h:[0,32,0]}} },
  seq:[['down',0.8],['up',1.6],['up',0.4],['down',2]],
};

M['Child’s pose'] = {
  cam:{yaw:75, pitch:14},
  hl:['lumbar','chest'],
  base:{root:[0,26,0], pel:[95,0,0], sp:[8,0,0], ch:[3,0,0], nk:[-10,0],
    lL:{ik:[9,5,-5], pole:[0.55,1,-0.1], a:-60}, rL:{ik:[-9,5,-5], pole:[-0.55,1,-0.1], a:-60},
    lA:{ik:[18,3,95], pole:[0.3,-1,0], hd:[0,0,1]}, rA:{ik:[-18,3,95], pole:[-0.3,-1,0], hd:[0,0,1]}},
  poses:{ out:{}, in:{root:[0,27.5,0.5], sp:[11,0,0], nk:[-14,0]} },
  seq:[['out',3],['in',2.5]],
};

M['Downward dog'] = {
  cam:{yaw:90, pitch:6},
  hl:['rShin','lShin'],
  base:{root:[0,80,0], pel:[142,0,0], sp:[0,0,0], nk:[-5,0],
    lL:{pl:[10,0,-30], hl:12, pole:[0,0.8,-0.6]}, rL:{pl:[-10,0,-30], hl:12, pole:[0,0.8,-0.6]},
    lA:{ik:[17,3,60], pole:[0.3,-1,0], hd:[0,0,1]}, rA:{ik:[-17,3,60], pole:[-0.3,-1,0], hd:[0,0,1]}},
  poses:{ pedalR:{rL:{hl:40}, lL:{hl:0}}, pedalL:{lL:{hl:40}, rL:{hl:0}} },
  seq:[['pedalL',1.5],['pedalR',1.5]],
};

M['Low lunge + twist'] = {
  cam:{yaw:62, pitch:10},
  props:[{box:[0,24,0,3,-40,-10], k:'towel'}],
  hl:['lThigh','chest'],
  base:{root:[0,44,0], pel:[8,0,0], sp:[-4,0,0], nk:[0,0],
    rL:{pl:[-11,0,57], pole:[0,0,1]},
    lL:{ik:[11,7,-68], pole:[0,-0.4,1], a:-60},
    rA:{ik:[-14,52,40], pole:[-0.5,-0.2,-1]}, lA:{ik:[-2,52,42], pole:[0.5,-0.2,-1]}},
  poses:{
    lunge:{},
    twist:{pel:[14,0,-10], sp:[2,0,-20], ch:[0,0,-25], nk:[-10,-10],
      rA:{ik:[-30,140,-5], pole:[-1,0,-0.3]}, lA:{ik:[-12,50,40], pole:[0.5,-0.2,-1]}},
  },
  seq:[['lunge',2.5],['lunge',1],['twist',2.5],['twist',2.5]],
};

M['Half splits'] = {
  cam:{yaw:82, pitch:8},
  props:[{box:[0,24,0,3,-20,5], k:'towel'}],
  hl:['rThigh'],
  base:{root:[0,54,0], pel:[72,0,0], sp:[10,0,0], ch:[6,0,0], nk:[-15,0],
    rL:{pl:[-11,20,91], hl:-60, pole:[0,0.47,-0.88]},
    lL:{ik:[11,6,-45], pole:[0,-0.4,1], a:-60},
    lA:{ik:[8,3,52], pole:[0.3,-1,0], hd:[0,0,1]}, rA:{ik:[-28,3,52], pole:[-0.3,-1,0], hd:[0,0,1]}},
  poses:{ a:{}, b:{pel:[78,0,0], sp:[12,0,0], ch:[8,0,0]} },
  seq:[['a',2.5],['b',2.5]],
};

M['Sphinx'] = {
  cam:{yaw:90, pitch:6},
  hl:['lumbar'],
  base:{root:[0,11,0], pel:[88,0,0], sp:[-15,0,0], ch:[-25,0,0], nk:[10,0],
    lL:{h:[2.5,3,0], k:0, a:-75}, rL:{h:[2.5,3,0], k:0, a:-75},
    lA:{ik:[16,4,60], pole:[0,-0.64,0.77], hd:[0,0,1]}, rA:{ik:[-16,4,60], pole:[0,-0.64,0.77], hd:[0,0,1]}},
  poses:{ a:{}, b:{sp:[-17,0,0], ch:[-28,0,0]} },
  seq:[['a',2.5],['b',2]],
};

M['Half-kneel hip flexor stretch'] = {
  cam:{yaw:90, pitch:6},
  props:[{box:[-24,4,0,7,-22,6], k:'soft'}],
  hl:['rThigh'],
  base:{root:[0,55,0], pel:[4,0,0], sp:[-2,0,0], nk:[0,0],
    rL:{ik:[-10,7,-50], pole:[0,0,1], a:-60},
    lL:{pl:[11,0,58], pole:[0,0,1]},
    lA:{s:[5,8,0], e:15}, rA:{s:[5,8,0], e:15}},
  poses:{ start:{}, fwd:{root:[0,54,10], pel:[-8,0,0], sp:[8,0,0]} },
  seq:[['start',2],['fwd',2.5],['fwd',1.5]],
};
})(window.MOVES, window.POSE);

/* ---- fix1: clearer supine twist, child’s pose, figure-4, half splits ---- */
(function(M,P){
const clone=o=>JSON.parse(JSON.stringify(o));

// ---- Supine twist: viewed from the head end (camera above the head), arms in a T on the floor, bent knees drop to the right
(function(){
  const Z=66;                                    // head near z=0 so the whole body sits above the floor line
  const arms=(z)=>({lA:{ik:[70,4,z], pole:[0,1,0], hd:[1,-0.05,0]}, rA:{ik:[-70,4,z], pole:[0,1,0], hd:[-1,-0.05,0]}});
  M['Supine twist'] = {
    cam:{yaw:180, pitch:45},
    props:[{box:[-32,32,0,1,Z-74,Z+74], k:'soft'}],
    hl:['lumbar'],
    base:Object.assign({root:[0,11,Z], pel:[-90,-90,90], sp:[0,0,0], ch:[0,0,0], nk:[15,0],
      lL:{h:[45,-4,0], k:98, a:-35}, rL:{h:[45,-4,0], k:98, a:-35}}, arms(Z-44)),
    poses:{
      mid:{},
      drop:{root:[0,14.5,Z], pel:[-162,-90,90], sp:[0,0,32], ch:[0,0,35], nk:[15,-25],
        lL:{h:[62,-6,0], k:105, a:0}, rL:{h:[62,-6,0], k:105, a:0}},
      deep:{root:[0,15.5,Z], pel:[-170,-90,90], sp:[0,0,35], ch:[0,0,38], nk:[15,-28],
        lL:{h:[64,-6,0], k:105, a:0}, rL:{h:[64,-6,0], k:105, a:0}},
    },
    seq:[['mid',1.5],['drop',2.5],['deep',2],['drop',2]],
  };
})();

// ---- Child's pose: side view, hips back to the heels, chest over the thighs, arms long, forehead down
M['Child’s pose'] = {
  cam:{yaw:90, pitch:4},
  hl:['lumbar','chest'],
  base:{root:[0,28,0], pel:[70,0,0], sp:[10,0,0], ch:[25,0,0], nk:[50,0],
    lL:{ik:[9,5,-5], pole:[0.55,1,-0.1], a:-60}, rL:{ik:[-9,5,-5], pole:[-0.55,1,-0.1], a:-60},
    lA:{ik:[19,3,93], pole:[0.3,-1,0], hd:[0,0,1]}, rA:{ik:[-19,3,93], pole:[-0.3,-1,0], hd:[0,0,1]}},
  poses:{ out:{}, in:{root:[0,29.5,0], sp:[12,0,0], ch:[25,0,0], nk:[51,0]} },
  seq:[['out',3],['in',2.5]],
};

// ---- Figure-4 stretch: raised side view, right (near) ankle crossed over the left knee, left hand draws the left thigh in,
//      right hand rests on the floor (keeps the near side uncluttered)
function f4(f){
  const D=Math.PI/180, u=[Math.cos(f*D), Math.sin(f*D)];      // [z,y] direction of the left thigh
  const ant=[Math.cos((f+90)*D), Math.sin((f+90)*D)], post=[-ant[0],-ant[1]];
  const at=(t,off,n)=>[11+t*44*u[1]+off*n[1], t*44*u[0]+off*n[0]];
  const ank=at(0.88,8,ant), hnd=at(0.62,7,post);
  return {lL:{h:[f,0,0], k:f, a:5}, rL:{ik:[13,ank[0],ank[1]], pole:[-1,0.1,0.15], a:18},
    lA:{ik:[14,hnd[0],hnd[1]], pole:[1,-0.3,0]}, rA:{ik:[-30,3,-4], pole:[-1,0,0]}};
}
M['Figure-4 stretch'] = {
  cam:{yaw:90, pitch:30},
  hl:['hips'],
  base:Object.assign(P.hookLying(), {nk:[20,0]}, f4(98)),
  poses:{ ease:{}, draw:Object.assign({nk:[26,0]}, f4(118)) },
  seq:[['ease',1.2],['draw',2.5],['draw',1],['ease',2.5]],
};

// ---- Half splits: back knee down, front leg straight with the heel on the floor, hinge over it
(function(){
  const R=[0,50,-2];
  const pose=(p,sp,ch)=>({root:R, pel:[p,0,0], sp:[sp,0,0], ch:[ch,0,0], rL:{h:[p+61,0,0], k:0, a:28, t:0}});
  M['Half splits'] = {
    cam:{yaw:90, pitch:6},
    props:[{box:[0,24,0,3,-24,6], k:'towel'}, {box:[-33,-19,0,15,33,47], k:'soft', front:true}, {box:[3,17,0,15,33,47], k:'soft'}],
    hl:['rThigh'],
    base:Object.assign(pose(50,8,6), {nk:[-12,0],
      lL:{ik:[11,6,-44], pole:[0,-0.4,1], a:-60},
      lA:{ik:[10,18.5,39], pole:[0.3,-1,0], hd:[0,-0.1,1]}, rA:{ik:[-26,18.5,39], pole:[-0.3,-1,0], hd:[0,-0.1,1]}}),
    poses:{ a:{}, b:pose(62,10,8) },
    seq:[['a',2.5],['b',3],['b',1],['a',2.5]],
  };
})();
})(window.MOVES, window.POSE);

/* ---- camera tweaks: 3/4 views read better than front-on for these ---- */
(function(M){
  if(M['Archer push-up']) M['Archer push-up'].cam={yaw:125, pitch:30};
  if(M['Bear-crawl shoulder taps']) M['Bear-crawl shoulder taps'].cam={yaw:55, pitch:20};
})(window.MOVES);

/* ---- fix2: cat–cow with hands and knees planted and a clear round/arch ---- */
(function(M,P){
const Q = {root:[0,52,-10], pel:[85,0,0], sp:[0,0,0], ch:[0,0,0], nk:[-8,0],
  lL:{ik:[11,6,-53], pole:[0,0,1], a:-60}, rL:{ik:[-11,6,-53], pole:[0,0,1], a:-60},
  lA:{ik:[17,3,34], pole:[0.3,-1,0], hd:[0,0,1]}, rA:{ik:[-17,3,34], pole:[-0.3,-1,0], hd:[0,0,1]}};
M['Cat–cow'] = {
  hl:['lumbar','chest'],
  base:Q,
  poses:{
    flat:{},
    cat:{pel:[68,0,0], root:[0,51,-10], sp:[-8,0,0], ch:[46,0,0], nk:[40,0]},
    cow:{pel:[99,0,0], root:[0,52,-10], sp:[2,0,0], ch:[-30,0,0], nk:[-34,0]},
  },
  seq:[['flat',1.2],['cat',2.5],['cat',0.6],['flat',1.6],['cow',1.6],['cow',0.6]],
};
})(window.MOVES, window.POSE);

/* ---- fix2: Y-W-T seen from above the feet, so the letters read ---- */
(function(M,P){
// Prone, face down, head toward +z. Viewed from the feet end, looking down, so the letters read upright.
const base={root:[0,11,0], pel:[90,0,0], sp:[0,0,0], ch:[0,0,0], nk:[6,0],
  lL:{h:[0,3,0], k:0, a:-78}, rL:{h:[0,3,0], k:0, a:-78}};
const arms=(L)=>({lA:L(1), rA:L(-1)});
const Y=(y)=>arms(s=>({ik:[s*54, y, 80], pole:[s*0.2,0,-1]}));
const W=(y)=>arms(s=>({ik:[s*46, y, 52], pole:[s*0.8,-1,-0.3]}));
const T=(y)=>arms(s=>({ik:[s*70, y, 43], pole:[s*0.1,0,-1]}));
const lift={ch:[-6,0,0], nk:[0,0]};
M['Prone Y-W-T'] = {
  cam:{yaw:160, pitch:55},
  floor:false,
  props:[{box:[-38,38,0,1.2,-110,92], k:'soft'}],
  hl:['shoulders','chest','lUpper','rUpper'],
  base:Object.assign({}, base, Y(5)),
  poses:{
    y0:Y(5),           y1:Object.assign({}, Y(20), lift),
    w0:W(5),           w1:Object.assign({}, W(19), lift),
    t0:T(5),           t1:Object.assign({}, T(19), lift),
  },
  seq:[['y0',1.1],['y1',1],['y1',0.8],['y0',0.9],
       ['w0',1],['w1',1],['w1',0.8],['w0',0.9],
       ['t0',1],['t1',1],['t1',0.8],['t0',0.9]],
};
})(window.MOVES, window.POSE);

/* ---- fix2: scap push-ups and arm circles as two framed parts; plainer side planks ---- */
(function(M){
  // Split the combined move into two parts that alternate, each framed on its own:
  // a close plank for the shoulder-blade squeezes, then standing arm circles.
  const old=M['Scap push-ups + arm circles'];
  if(!old || old.alt) return;
  const P=old.poses;
  const scap={hl:['shoulders','chest'], base:old.base, poses:{spread:P.spread, squeeze:P.squeeze},
    seq:[['spread',0.9],['squeeze',0.9]], loops:4};
  const circles={hl:['shoulders','lUpper','rUpper'], base:P.c0, poses:{c0:P.c0, c1:P.c1, c2:P.c2, c3:P.c3},
    seq:[['c0',0.9,'lin'],['c1',0.9,'lin'],['c2',0.9,'lin'],['c3',0.9,'lin']], loops:2};
  M['Scap push-ups + arm circles']={alt:[scap, circles]};
  // front-on, a torso highlight reads as a blob; the figure alone is clearer
  ['Side plank','Side plank, knees bent','Side plank + leg lift'].forEach(n=>{ if(M[n]) M[n].hl=[]; });
})(window.MOVES);

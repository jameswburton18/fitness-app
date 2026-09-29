// Print key joint positions for each pose of a move: node dev/joints.js "Move name" [extra.js]
global.window = global; global.document = undefined;
require('../figure.js'); require('../moves.js');
if (process.argv[3]) require(require('path').resolve(process.argv[3]));
const mv = MOVES[process.argv[2]];
if (!mv) { console.log('missing'); process.exit(1); }
const c = Figure.compile(mv);
const r = v => v.map(x => x.toFixed(1)).join(',');
const d = (a, b) => Math.hypot(a[0]-b[0], a[1]-b[1], a[2]-b[2]).toFixed(1);
Object.keys(c.poses).forEach(k => {
  const J = Figure.solve(c.poses[k]);
  console.log(k.padEnd(8), 'pelvis', r(J.pelvis), '| rSh', r(J.rSh), 'rWr', r(J.rWr), 'reach', d(J.rSh, J.rWr),
    '| rKnee', r(J.rKnee), 'rAnk', r(J.rAnk), 'hip-ank', d(J.rHip, J.rAnk), '| head', r(J.head));
});

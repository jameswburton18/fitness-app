# Authoring exercise animations

The app shows a looping pictogram demo for each exercise. The engine is `figure.js` (read its header comment).
Reference moves and pose presets live in `moves.js`; read them first, since they are known to render correctly.

## Conventions (verified)
- Units are cm. `y` is up and the floor is `y = 0`. The figure faces **+z**, and its **left is +x**.
- Default camera `{yaw:90, pitch:6}` is a side view: the figure faces screen-right and we see its **right** side, so right limbs are "near" (drawn bright; far limbs are drawn grey).
  Screen-x = world z. `yaw:0` is a front view (screen-right = world +x = figure's left). `yaw:30–60` is a 3/4 view. `pitch` up to ~35 looks down on floor work.
- **Author single-side moves working the figure's RIGHT side** (the near side). The app mirrors the drawing for "Left side" sets.
- Standing: pelvis (hip-joint line) at y≈94.6 when fully straight. Leg = thigh 44 + shin 43 + ankle height 8. Torso: pelvis→neck base 48. Upper arm 29, forearm 25, hand 8.
  Shoulders sit ±17 from the spine, hips ±9.
- `pel:[pitch, roll, yaw]`: pitch +90 = lying face down with the head toward +z. Pitch −90 = lying on the back with the head toward −z. Pitch −120 = bridge (hips up, shoulders on the floor).
  Roll +90 = lying on the RIGHT side with the head toward −x. Pelvis-local forward (the knee pole default) follows these rotations.
- Spine `sp:[flex, side, twist]` (lumbar) and `ch:[...]` (thoracic, defaults to sp). flex+ = round forward. `nk:[flex, twist]`: flex+ = chin to chest.
- Legs:
  - **planted** `{pl:[x,0,z] ball-of-foot, hl:heelLift°, dir:footYaw°, tu:toesUp°, pole}`. The ankle is solved from the foot, and the knee by IK.
    `hl` negative drops the heel below the ball (off a step edge). Put `pl` y at the step height when standing on a step.
  - **IK** `{ik:[x,y,z] ankle target, pole:[x,y,z] pelvis-local, a:ankle°, t:toe°}` for kneeling or lying feet.
  - **FK** `{h:[flex, abd, rot], k:kneeBend, a:ankle° (+ = toes up), t:toe°}` for free legs. flex+ swings the leg forward and abd+ swings it out.
- Arms: **FK** `{s:[flex, abd, rot], e:elbowBend}` (flex+ = forward/up, abd+ = out to the side) or **IK** `{ik:[x,y,z] wrist, pole:[x,y,z] chest-local, hd:[x,y,z] world hand direction}`.
  Default elbow pole = back and out. For a left arm "out" is +x, for a right arm it is −x.
- `pin:{j:'rBall', at:[x,y,z]}` translates the whole figure so that joint lands there. Use it to keep FK feet/toes planted (push-up, plank).
  Don't pin a joint on an IK limb.
- If an IK target is out of reach, the limb goes straight and the foot or hand floats. Fix it by moving `root`.
- Joints you can pin or reference: pelvis, mid, neck, chest, head, neckTop, lHip/rHip, lKnee, lAnk, lHeel, lBall, lToe, lSh, lElb, lWr, lHand (and r*).
- `root` is the pelvis centre; with `pin` it is just a starting point.

## Move object
```js
M['Exact exercise name'] = {
  cam:{yaw:90, pitch:6},            // optional
  props:[ {box:[x0,x1,y0,y1,z0,z1], k:'soft'|'wall'|'towel'|undefined, noFit:true?, front:true?},
          {cyl:[[x,y,z],[x,y,z]], r:4, k:'towel'} ],
  att:[ {kind:'band', a:'lKnee', b:'rKnee', chain:'rLeg'},   // loop band (blue line)
        {kind:'kb', at:'rWr', chain:'rArm'},                 // kettlebell hanging from a wrist
        {kind:'cuff', at:'rAnk', chain:'rLeg'},              // ankle weight
        {kind:'stick', a:'head', b:'pelvis', off:-14, ext:12, chain:'torso'}, // broomstick (off = sideways offset in screen units)
        {kind:'towel', at:'rHeel', chain:'rLeg'} ],          // towel under the heel (slider)
  hl:['rThigh','lThigh'],           // highlighted (amber) segments = where it should be felt
  base:{...full pose...},
  poses:{ name:{...overrides merged onto base...}, ... },
  seq:[['start',1],['down',3],['down',0.5],['start',1.5]],   // [pose, secs to reach it, ease?('sine'|'lin'|'out'|'in')]
  zoom:[xmin,xmax,ymin,ymax],        // optional fixed window in projected screen units (y is DOWN, so y=-40 is 40cm above the floor)
  pad:10                            // optional padding
};
```
Highlight segment names: lThigh rThigh lShin rShin lFoot rFoot lToes rToes lUpper rUpper lFore rFore lHand rHand lumbar chest hips shoulders head.

- Common props: bottom stair `box:[-40,40,0,18,z0,z0+28]`, chair seat `box:[-22,22,0,45,z0,z0+42]` (+ a back box), sofa seat 42 high (arm 60), bed 55, wall = a thin box `noFit:true`, table top at 72, towel roll `cyl` r≈3.5 along x.
- Keep every pose in the SAME limb mode (planted/IK/FK) across poses, because modes can't blend.
- Timing: one loop = one rep, following the tempo cues in the program ("3s down" → 3). For timed holds and stretches, loop a gentle 3–5s motion (settle in, breathe, small pulse) so the figure isn't frozen. Circles can use several keyframes with `'lin'` ease.

## Verify visually (required)
```
python3 dev/shoot.py /tmp/claude-0/<you>-1.png --parts <yourfile> "Name one|Name two"
```
Then `Read` the PNG. Each row shows a move's keyframes. Add `--flip` to see the mirrored side and `--mid` to add a mid-loop frame. Check that:
- feet and hands contact the floor, step or wall where they should (no floating, no sinking through the floor)
- knees and elbows bend the anatomically right way
- the key action reads clearly at a glance from the chosen camera
- highlighted segments match where the program says it should be felt

/* Sturdy figure engine — a tiny 3D pictogram rig drawn to SVG.
   World units are cm. y is up. The figure faces +z; its left is +x.
   A move = { cam, props, hl, base, poses:{name:pose}, seq:[[name, secs, ease?], ...] }.
   A pose:
     root:[x,y,z]            pelvis centre (hip-joint line)
     pel:[pitch, roll, yaw]  pitch+ tips the torso forward, roll+ tips it to the figure's right, yaw+ turns left
     sp:[flex, side, twist]  lumbar bend (flex+ = forward), ch: same for the thoracic spine (defaults to sp)
     nk:[flex, twist]        neck (flex+ = chin down)
     lL/rL legs: FK {h:[flex, abd, rot], k:bend, a:ankle(+ = toes up), t:toe(+ = toes bent up)}
                 IK {ik:[x,y,z] ankle target, pole:[x,y,z] pelvis-local knee direction, a, t}
                 planted {pl:[x,y,z] ball of foot, hl:heel lift deg (neg = heel drops), dir:foot yaw deg, tu:toes lifted deg, pole}
     lA/rA arms: FK {s:[flex, abd, rot], e:bend}   IK {ik:[x,y,z] wrist target, pole:[x,y,z] chest-local elbow direction, hd:[x,y,z] hand dir}
*/
(function(global){
'use strict';
const D = Math.PI/180;
// ---------- vectors ----------
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const len=a=>Math.hypot(a[0],a[1],a[2]);
const norm=a=>{ const l=len(a)||1; return [a[0]/l,a[1]/l,a[2]/l]; };
const lerp=(a,b,u)=>a+(b-a)*u;
// ---------- 3x3 matrices as [xAxis, yAxis, zAxis] columns ----------
const tf=(M,v)=>[M[0][0]*v[0]+M[1][0]*v[1]+M[2][0]*v[2], M[0][1]*v[0]+M[1][1]*v[1]+M[2][1]*v[2], M[0][2]*v[0]+M[1][2]*v[1]+M[2][2]*v[2]];
const mm=(A,B)=>[tf(A,B[0]), tf(A,B[1]), tf(A,B[2])];
const Rx=a=>{ const c=Math.cos(a*D), s=Math.sin(a*D); return [[1,0,0],[0,c,s],[0,-s,c]]; };
const Ry=a=>{ const c=Math.cos(a*D), s=Math.sin(a*D); return [[c,0,-s],[0,1,0],[s,0,c]]; };
const Rz=a=>{ const c=Math.cos(a*D), s=Math.sin(a*D); return [[c,s,0],[-s,c,0],[0,0,1]]; };
const rot3=v=>{ v=v||[0,0,0]; return mm(mm(Ry(v[2]||0), Rx(v[0]||0)), Rz(v[1]||0)); };

// ---------- body dimensions (cm) ----------
const B = { hipW:9, lumbar:22, thor:26, shW:17, shDrop:4, neck:8, headUp:16, headR:10.5,
  upper:29, fore:25, hand:8, thigh:44, shin:43, ankH:8, heel:5, foot:14, toes:6 };

function ik(a, t, l1, l2, pole){
  let d=sub(t,a), dist=len(d);
  const n = dist>1e-6 ? mul(d,1/dist) : [0,-1,0];
  dist = Math.max(Math.abs(l1-l2)+0.01, Math.min(l1+l2-0.01, dist));
  const x=(l1*l1-l2*l2+dist*dist)/(2*dist), h=Math.sqrt(Math.max(0,l1*l1-x*x));
  let pv=sub(pole, mul(n,dot(pole,n)));
  if(len(pv)<1e-6) pv = Math.abs(n[1])<0.9 ? norm(cross(n,[0,1,0])) : [0,0,1];
  pv=norm(pv);
  return { mid:add(a,add(mul(n,x),mul(pv,h))), end:add(a,mul(n,dist)), pv };
}

// Foot geometry from a foot frame F (x lateral, y sole normal, z forward) and the ankle.
function footFrom(J, s, ank, F, toe){
  const sole=sub(ank, mul(F[1],B.ankH));
  J[s+'Heel']=sub(sole, mul(F[2],B.heel));
  J[s+'Ball']=add(sole, mul(F[2],B.foot));
  const tc=Math.cos((toe||0)*D), ts=Math.sin((toe||0)*D);
  J[s+'Toe']=add(J[s+'Ball'], mul(add(mul(F[2],tc), mul(F[1],ts)), B.toes));
  J[s+'Ank']=ank;
}

function leg(J, s, sg, L, P){
  const hip=J[s+'Hip'];
  if(L.pl){
    const dr=(L.dir||0)*D, fwd=[Math.sin(dr),0,Math.cos(dr)], up=[0,1,0];
    const h=(L.hl||0)*D;
    const z=norm(sub(mul(fwd,Math.cos(h)), mul(up,Math.sin(h))));
    const y=norm(add(mul(up,Math.cos(h)), mul(fwd,Math.sin(h))));
    const ball=L.pl, sole=sub(ball, mul(z,B.foot));
    let ank=add(sole, mul(y,B.ankH));
    const pole=tf(P, L.pole||[0,0,1]);
    const r=ik(hip, ank, B.thigh, B.shin, pole);
    const off=sub(r.end, ank);           // unreachable → foot follows the leg (and floats)
    J[s+'Knee']=r.mid; J[s+'Ank']=r.end;
    J[s+'Heel']=add(sub(sole, mul(z,B.heel)),off);
    J[s+'Ball']=add(ball,off);
    const tu=(L.tu||0)*D;
    J[s+'Toe']=add(J[s+'Ball'], mul(add(mul(fwd,Math.cos(tu)), mul(up,Math.sin(tu))), B.toes));
    return;
  }
  if(L.ik){
    const pole=tf(P, L.pole||[0,0,1]);
    const r=ik(hip, L.ik, B.thigh, B.shin, pole);
    J[s+'Knee']=r.mid;
    const ys=norm(sub(r.mid, r.end));
    let zs=sub(r.pv, mul(ys, dot(r.pv,ys))); zs=len(zs)<1e-6?[0,0,1]:norm(zs);
    const S=[cross(ys,zs), ys, zs];
    footFrom(J, s, r.end, mm(S, Rx(-(L.a||0))), L.t);
    return;
  }
  const h=L.h||[0,0,0];
  const T=mm(mm(mm(P, Rz(sg*(h[1]||0))), Rx(-(h[0]||0))), Ry(sg*(h[2]||0)));
  J[s+'Knee']=add(hip, tf(T,[0,-B.thigh,0]));
  const S=mm(T, Rx(L.k||0));
  const ank=add(J[s+'Knee'], tf(S,[0,-B.shin,0]));
  footFrom(J, s, ank, mm(S, Rx(-(L.a||0))), L.t);
}

function arm(J, s, sg, A, T){
  const sh=J[s+'Sh'];
  let wr, dir;
  if(A.ik){
    const pole=tf(T, A.pole||[sg*0.5,-0.2,-1]);
    const r=ik(sh, A.ik, B.upper, B.fore, pole);
    J[s+'Elb']=r.mid; wr=r.end; dir=norm(sub(r.end, r.mid));
  } else {
    const a=A.s||[0,0,0];
    const U=mm(mm(mm(T, Rz(sg*(a[1]||0))), Rx(-(a[0]||0))), Ry(sg*(a[2]||0)));
    J[s+'Elb']=add(sh, tf(U,[0,-B.upper,0]));
    const E=mm(U, Rx(-(A.e||0)));
    wr=add(J[s+'Elb'], tf(E,[0,-B.fore,0])); dir=tf(E,[0,-1,0]);
  }
  J[s+'Wr']=wr;
  J[s+'Hand']=add(wr, mul(A.hd?norm(A.hd):dir, B.hand));
}

// pin:{j:'rBall', at:[x,y,z]} moves the whole figure so that joint lands on that point
// (IK targets stay put, so pin a joint that is not on an IK'd limb).
function solve(p){
  if(p.pin && p.pin.j){
    const J0=solve0(p, p.root||[0,95,0]);
    const off=sub(p.pin.at, J0[p.pin.j]||p.pin.at);
    return solve0(p, add(p.root||[0,95,0], off));
  }
  return solve0(p, p.root||[0,95,0]);
}
function solve0(p, root){
  const J={};
  const pl=p.pel||[0,0,0];
  const P=mm(mm(Ry(pl[2]||0), Rx(pl[0]||0)), Rz(pl[1]||0));
  J.pelvis=root; J._P=P;
  J.lHip=add(root, tf(P,[B.hipW,0,0])); J.rHip=add(root, tf(P,[-B.hipW,0,0]));
  const L=mm(P, rot3(p.sp));
  J.mid=add(root, tf(L,[0,B.lumbar,0]));
  const T=mm(L, rot3(p.ch||p.sp));
  J._T=T;
  J.neck=add(J.mid, tf(T,[0,B.thor,0]));
  J.chest=add(J.mid, tf(T,[0,B.thor-7,0]));
  J.lSh=add(J.neck, tf(T,[B.shW,-B.shDrop,0])); J.rSh=add(J.neck, tf(T,[-B.shW,-B.shDrop,0]));
  const nk=p.nk||[0,0];
  const H=mm(T, mm(Ry(nk[1]||0), Rx(nk[0]||0)));
  J.head=add(J.neck, tf(H,[0,B.headUp,2])); J.neckTop=add(J.neck, tf(H,[0,B.neck,1]));
  leg(J,'l', 1, p.lL||{}, P); leg(J,'r',-1, p.rL||{}, P);
  arm(J,'l', 1, p.lA||{}, T); arm(J,'r',-1, p.rA||{}, T);
  return J;
}

// ---------- pose interpolation ----------
function mix(a,b,u){
  if(a===undefined) return b; if(b===undefined) return a;
  if(typeof a==='number' && typeof b==='number') return lerp(a,b,u);
  if(Array.isArray(a) && Array.isArray(b)){ const n=Math.max(a.length,b.length), o=[]; for(let i=0;i<n;i++) o.push(mix(a[i],b[i],u)); return o; }
  if(a && b && typeof a==='object' && typeof b==='object'){
    const o={}; const ks=new Set([...Object.keys(a),...Object.keys(b)]);
    ks.forEach(k=>{ o[k]=mix(a[k],b[k],u); }); return o;
  }
  return u<0.5?a:b;
}
function merge(a,b){
  if(b===undefined) return a;
  if(a && b && typeof a==='object' && typeof b==='object' && !Array.isArray(a) && !Array.isArray(b)){
    const o=Object.assign({},a); Object.keys(b).forEach(k=>{ o[k]=merge(a[k],b[k]); }); return o;
  }
  return b;
}
const EASE={
  sine:u=>0.5-0.5*Math.cos(Math.PI*u),
  lin:u=>u,
  out:u=>1-(1-u)*(1-u),
  in:u=>u*u,
};
function compile(mv){
  if(mv._c) return mv._c;
  const poses={};
  Object.keys(mv.poses||{}).forEach(k=>{ poses[k]=merge(mv.base||{}, mv.poses[k]); });
  const seq=(mv.seq||[[Object.keys(poses)[0]||'_',1]]).map(e=>({p:poses[e[0]]||mv.base||{}, d:Math.max(0.0001,e[1]||0), e:EASE[e[2]]||EASE.sine, name:e[0]}));
  let total=0; seq.forEach((e,i)=>{ if(i>0) total+=e.d; }); total+=seq[0].d;
  const c={seq, total, poses};
  Object.defineProperty(mv,'_c',{value:c, enumerable:false});
  return c;
}
function sample(mv, t){
  const c=compile(mv), n=c.seq.length;
  if(n===1) return c.seq[0].p;
  let tt=((t%c.total)+c.total)%c.total;
  for(let i=1;i<=n;i++){
    const e=c.seq[i%n], d=e.d;
    if(tt<=d){ return mix(c.seq[i-1].p, e.p, e.e(Math.min(1,tt/d))); }
    tt-=d;
  }
  return c.seq[0].p;
}
// times at which each keyframe is reached (for contact sheets)
function keyTimes(mv){ const c=compile(mv); const out=[0]; let t=0; for(let i=1;i<c.seq.length;i++){ t+=c.seq[i].d; out.push(t); } return out; }

// ---------- camera ----------
function camera(cam){
  const yaw=(cam&&cam.yaw!==undefined?cam.yaw:90)*D, pitch=(cam&&cam.pitch!==undefined?cam.pitch:6)*D;
  const R=[Math.cos(yaw),0,Math.sin(yaw)], U0=[0,1,0], F0=[-R[2],0,R[0]];
  const U=sub(mul(U0,Math.cos(pitch)), mul(F0,Math.sin(pitch)));
  const F=add(mul(F0,Math.cos(pitch)), mul(U0,Math.sin(pitch)));
  return p=>[dot(p,R), -dot(p,U), dot(p,F)];
}

// ---------- geometry → path strings ----------
const f1=n=>Math.round(n*10)/10;
function capsule(a,b,r1,r2){
  let dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy);
  if(L<0.05){ dx=0.05; dy=0; L=0.05; }
  const ux=dx/L, uy=dy/L, vx=-uy, vy=ux;
  let s=(r1-r2)/L; s=Math.max(-0.98,Math.min(0.98,s)); if(Math.abs(s)<1e-4) s=1e-4;
  const c=Math.sqrt(1-s*s);
  const nx1=s*ux+c*vx, ny1=s*uy+c*vy, nx2=s*ux-c*vx, ny2=s*uy-c*vy;
  const A1=[a[0]+r1*nx1,a[1]+r1*ny1], A2=[b[0]+r2*nx1,b[1]+r2*ny1], B2=[b[0]+r2*nx2,b[1]+r2*ny2], B1=[a[0]+r1*nx2,a[1]+r1*ny2];
  const lf2=s<0?1:0, lf1=s>0?1:0;
  return 'M'+f1(A1[0])+' '+f1(A1[1])+'L'+f1(A2[0])+' '+f1(A2[1])+'A'+f1(r2)+' '+f1(r2)+' 0 '+lf2+' 0 '+f1(B2[0])+' '+f1(B2[1])+
         'L'+f1(B1[0])+' '+f1(B1[1])+'A'+f1(r1)+' '+f1(r1)+' 0 '+lf1+' 0 '+f1(A1[0])+' '+f1(A1[1])+'Z';
}
function poly(pts){ // oriented to match capsule winding (negative shoelace area)
  let A=0; for(let i=0;i<pts.length;i++){ const p=pts[i], q=pts[(i+1)%pts.length]; A+=p[0]*q[1]-q[0]*p[1]; }
  if(A>0) pts=pts.slice().reverse();
  return 'M'+pts.map(p=>f1(p[0])+' '+f1(p[1])).join('L')+'Z';
}

// Figure parts. Each: [chain, kind, joints..., radii...]
const SEGS=[
  // torso
  ['torso','poly',['lSh','rSh','rHip','lHip']],
  ['torso','cap','lSh','rSh',7.5,7.5,'shoulders'],
  ['torso','cap','lHip','rHip',9,9,'hips'],
  ['torso','cap','lSh','lHip',7,8.5],
  ['torso','cap','rSh','rHip',7,8.5],
  ['torso','cap','pelvis','mid',12,11,'lumbar'],
  ['torso','cap','mid','chest',11,11.5,'chest'],
  ['head','cap','neck','neckTop',4.6,4.4],
  ['head','cap','head','head',10.5,10.5,'head'],
];
['l','r'].forEach(s=>{
  SEGS.push([s+'Leg','cap',s+'Hip',s+'Knee',8.2,5.6, s+'Thigh']);
  SEGS.push([s+'Leg','cap',s+'Knee',s+'Ank',5.4,3.7, s+'Shin']);
  SEGS.push([s+'Leg','cap',s+'Ank',s+'Heel',3.8,3.3, s+'Foot']);
  SEGS.push([s+'Leg','cap',s+'Heel',s+'Ball',3.4,3.0, s+'Foot']);
  SEGS.push([s+'Leg','cap',s+'Ank',s+'Ball',3.6,3.0, s+'Foot']);
  SEGS.push([s+'Leg','cap',s+'Ball',s+'Toe',3.0,2.3, s+'Toes']);
  SEGS.push([s+'Arm','cap',s+'Sh',s+'Elb',5.4,4.2, s+'Upper']);
  SEGS.push([s+'Arm','cap',s+'Elb',s+'Wr',4.2,3.2, s+'Fore']);
  SEGS.push([s+'Arm','cap',s+'Wr',s+'Hand',3.5,2.8, s+'Hand']);
});
const CHAINS=['torso','head','lLeg','rLeg','lArm','rArm'];
const HALO=2.4;

const NS='http://www.w3.org/2000/svg';
const mk=(tag,attrs,parent)=>{ const e=document.createElementNS(NS,tag); if(attrs) for(const k in attrs) e.setAttribute(k,attrs[k]); if(parent) parent.appendChild(e); return e; };

// Props: boxes, cylinders, flat panels; plus attachments to joints.
function drawProps(g, props, P, front){
  (props||[]).forEach(pr=>{
    if(!!pr.front!==front) return;
    if(pr.box){
      const [x0,x1,y0,y1,z0,z1]=pr.box;
      const faces=[
        {n:[0,1,0], v:[[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]], c:'top'},
        {n:[0,-1,0], v:[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]], c:'side'},
        {n:[1,0,0], v:[[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]], c:'side'},
        {n:[-1,0,0], v:[[x0,y0,z0],[x0,y1,z0],[x0,y1,z1],[x0,y0,z1]], c:'side2'},
        {n:[0,0,1], v:[[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]], c:'side'},
        {n:[0,0,-1], v:[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]], c:'side2'},
      ];
      faces.forEach(f=>{
        const pts=f.v.map(P); const ctr=P(f.v[0]);
        // visible if the face normal points toward the camera: compare depth of (centre+normal) vs centre
        const c0=f.v.reduce((a,b)=>add(a,b),[0,0,0]).map(x=>x/4);
        if(P(add(c0,f.n))[2]-P(c0)[2] <= 1e-6) return;
        mk('path',{d:poly(pts.map(p=>[p[0],p[1]])), class:'fp-'+f.c+(pr.k?' fk-'+pr.k:''), 'stroke-linejoin':'round'}, g);
        void ctr;
      });
    } else if(pr.cyl){
      const a=P(pr.cyl[0]), b=P(pr.cyl[1]);
      mk('path',{d:capsule(a,b,pr.r||5,pr.r||5), class:'fp-top'+(pr.k?' fk-'+pr.k:'')}, g);
    } else if(pr.line){
      const a=P(pr.line[0]), b=P(pr.line[1]);
      mk('line',{x1:f1(a[0]),y1:f1(a[1]),x2:f1(b[0]),y2:f1(b[1]), class:'fp-line'+(pr.k?' fk-'+pr.k:''), 'stroke-width':pr.w||3, 'stroke-linecap':'round'}, g);
    }
  });
}

/* ---------- renderer ---------- */
function Stage(host, opts){
  opts=opts||{};
  const svg=mk('svg',{class:'fig-svg', 'aria-hidden':'true', preserveAspectRatio:'xMidYMax meet'});
  host.appendChild(svg);
  const flipG=mk('g',{},svg);
  const gFloor=mk('g',{class:'fig-floor'},flipG);
  const gBack=mk('g',{},flipG);
  const gFig=mk('g',{class:'fig'},flipG);
  const gFront=mk('g',{},flipG);
  const shadow=mk('ellipse',{class:'fig-shadow'},gFloor);
  const floor=mk('line',{class:'fig-ground'},gFloor);
  const chains={};
  CHAINS.forEach(c=>{
    const g=mk('g',{},gFig);
    chains[c]={g, halo:mk('path',{class:'fh'},g), fill:mk('path',{class:'ff'},g), hl:mk('path',{class:'fhl'},g), att:mk('g',{},g)};
  });
  let mv=null, P=null, vb=null, flip=false, t0=performance.now(), raf=0, running=false, tOff=0, speed=1, hlSet=new Set();

  function fit(){
    const c=compile(mv), N=28;
    let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
    const acc=(x,y,r)=>{ x0=Math.min(x0,x-r); x1=Math.max(x1,x+r); y0=Math.min(y0,y-r); y1=Math.max(y1,y+r); };
    for(let i=0;i<N;i++){
      const J=solve(sample(mv, c.total*i/N));
      for(const k in J){ if(k[0]==='_') continue; const p=P(J[k]); acc(p[0],p[1], k==='head'?13:9); }
    }
    (mv.props||[]).forEach(pr=>{
      if(pr.box){ const [a,b,c2,d,e,f]=pr.box; [[a,c2,e],[b,c2,e],[a,d,e],[b,d,e],[a,c2,f],[b,c2,f],[a,d,f],[b,d,f]].forEach(v=>{ const p=P(v); if(!pr.noFit) acc(p[0],p[1],1); }); }
      if(pr.cyl){ pr.cyl.forEach(v=>{ const p=P(v); acc(p[0],p[1],pr.r||5); }); }
    });
    const fl=P([0,0,0]); acc(fl[0], fl[1], 0);
    if(mv.zoom){ // explicit world-space window [x0,x1,y0,y1] in screen units
      [x0,x1,y0,y1]=mv.zoom;
    }
    const pad=mv.pad!==undefined?mv.pad:10;
    x0-=pad; x1+=pad; y0-=pad; y1+=Math.max(4,pad*0.4);
    const ar=opts.aspect||1.6; // width / height of the host box
    let w=x1-x0, h=y1-y0;
    if(w/h<ar){ const nw=h*ar; x0-=(nw-w)/2; w=nw; }
    else { const nh=w/ar; y0-=(nh-h); h=nh; } // keep the floor anchored at the bottom
    vb=[x0,y0,w,h];
    svg.setAttribute('viewBox', vb.map(f1).join(' '));
    floor.setAttribute('x1',f1(x0-50)); floor.setAttribute('x2',f1(x0+w+50));
    floor.setAttribute('y1',f1(fl[1])); floor.setAttribute('y2',f1(fl[1]));
  }

  function draw(t){
    if(!mv) return;
    const pose=sample(mv,t);
    const J=solve(pose);
    const S={}; for(const k in J){ if(k[0]!=='_') S[k]=P(J[k]); }
    const paths={}, hls={};
    CHAINS.forEach(c=>{ paths[c]={h:'',f:''}; hls[c]=''; });
    SEGS.forEach(sg=>{
      const c=sg[0];
      let dF, dH;
      if(sg[1]==='poly'){ const pts=sg[2].map(k=>S[k]); dF=poly(pts); dH=''; }
      else { dF=capsule(S[sg[2]],S[sg[3]],sg[4],sg[5]); dH=capsule(S[sg[2]],S[sg[3]],sg[4]+HALO,sg[5]+HALO); }
      paths[c].f+=dF; paths[c].h+=dH;
      if(sg[6] && hlSet.has(sg[6])) hls[c]+=dF;
    });
    // depth order
    const KS={torso:['pelvis','mid','neck'], head:['head'], lLeg:['lHip','lKnee','lAnk'], rLeg:['rHip','rKnee','rAnk'], lArm:['lSh','lElb','lWr'], rArm:['rSh','rElb','rWr']};
    const ROOT={lLeg:['lHip','pelvis'], rLeg:['rHip','pelvis'], lArm:['lSh','neck'], rArm:['rSh','neck']};
    const dep=c=>{
      const ks=KS[c], avg=ks.reduce((s,k)=>s+S[k][2],0)/ks.length;
      if(c==='head') return avg+4;
      if(ROOT[c]) return 0.55*S[ks[0]][2]+0.45*avg;
      return avg;
    };
    const order=CHAINS.map(c=>({c, d:dep(c)})).sort((a,b)=>a.d-b.d);
    order.forEach(o=>{
      const ch=chains[o.c];
      ch.halo.setAttribute('d', paths[o.c].h);
      ch.fill.setAttribute('d', paths[o.c].f);
      ch.hl.setAttribute('d', hls[o.c]);
      const far = ROOT[o.c] && (S[ROOT[o.c][0]][2] < S[ROOT[o.c][1]][2]-3);
      ch.g.setAttribute('class', far ? 'far' : 'near');
      // attachments on this chain
      let att='';
      (mv.att||[]).forEach(a=>{
        if(a.chain!==o.c) return;
        if(a.kind==='kb'){ const w=S[a.at]; att+='<circle class="fa-kb" cx="'+f1(w[0])+'" cy="'+f1(w[1]+9)+'" r="8.5"/><path class="fa-kbh" d="M'+f1(w[0]-5)+' '+f1(w[1]+2)+'Q'+f1(w[0])+' '+f1(w[1]-5)+' '+f1(w[0]+5)+' '+f1(w[1]+2)+'"/>'; }
        if(a.kind==='cuff'){ const k=S[a.at.replace('Ank','Knee')], an=S[a.at]; const p=[lerp(an[0],k[0],0.1), lerp(an[1],k[1],0.1)], q=[lerp(an[0],k[0],0.28), lerp(an[1],k[1],0.28)]; att+='<path class="fa-cuff" d="'+capsule(p,q,5.8,5.8)+'"/>'; }
        if(a.kind==='band'){ const pa=S[a.a], pb=S[a.b]; att+='<path class="fa-band" d="'+capsule(pa,pb,2,2)+'"/>'; }
        if(a.kind==='stick'){ const pa=S[a.a], pb=S[a.b]; const ex=a.ext||10; const dx=pb[0]-pa[0], dy=pb[1]-pa[1], l=Math.hypot(dx,dy)||1;
          const o2=a.off||0; const nx=-dy/l*o2, ny=dx/l*o2;
          att+='<path class="fa-stick" d="'+capsule([pa[0]-dx/l*ex+nx, pa[1]-dy/l*ex+ny],[pb[0]+dx/l*ex+nx, pb[1]+dy/l*ex+ny],2.2,2.2)+'"/>'; }
        if(a.kind==='towel'){ const h=S[a.at]; att+='<rect class="fa-towel" x="'+f1(h[0]-9)+'" y="'+f1(h[1]+1.5)+'" width="18" height="3.4" rx="1.7"/>'; }
      });
      ch.att.innerHTML=att;
      gFig.appendChild(ch.g);
    });
    // floor shadow under the figure
    let sx=0, n=0, mn=1e9, mx=-1e9;
    for(const k in J){ if(k[0]==='_') continue; const g=P([J[k][0],0,J[k][2]]); sx+=g[0]; n++; mn=Math.min(mn,g[0]); mx=Math.max(mx,g[0]); }
    const gy=P([0,0,0])[1];
    shadow.setAttribute('cx',f1(sx/n)); shadow.setAttribute('cy',f1(gy+1)); shadow.setAttribute('rx',f1((mx-mn)/2+14)); shadow.setAttribute('ry','4');
  }

  function frame(now){
    raf=0;
    if(!running) return;
    draw(((now-t0)/1000)*speed+tOff);
    raf=requestAnimationFrame(frame);
  }
  const api={
    set(move, o){
      o=o||{};
      mv=move; P=camera(move&&move.cam);
      hlSet=new Set(move&&move.hl||[]);
      flip=!!o.flip;
      if(!mv){ svg.style.visibility='hidden'; return api; }
      svg.style.visibility='';
      gBack.innerHTML=''; gFront.innerHTML='';
      drawProps(gBack, mv.props, P, false); drawProps(gFront, mv.props, P, true);
      fit();
      flipG.setAttribute('transform', flip ? 'translate('+f1(2*vb[0]+vb[2])+',0) scale(-1,1)' : '');
      t0=performance.now(); tOff=o.t||0;
      if(running){ /* keep running from the new move's start */ }
      draw(tOff);
      return api;
    },
    play(){ if(running) return api; running=true; t0=performance.now(); if(!raf) raf=requestAnimationFrame(frame); return api; },
    resize(a){ if(a>0.2 && a<8) opts.aspect=a; return api; },
    pause(){ if(running){ tOff=((performance.now()-t0)/1000)*speed+tOff; } running=false; if(raf){ cancelAnimationFrame(raf); raf=0; } return api; },
    at(t){ draw(t); return api; },
    speed(s){ if(running){ tOff=((performance.now()-t0)/1000)*speed+tOff; t0=performance.now(); } speed=s; return api; },
    get svg(){ return svg; },
    destroy(){ api.pause(); svg.remove(); },
  };
  return api;
}

global.Figure = { Stage, solve, sample, keyTimes, compile, camera, B, merge };
})(window);

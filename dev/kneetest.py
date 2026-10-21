"""Knee-ladder v3 test: v2->v3 migration, next-morning gate, toe spring gate, restore.
usage: python3 dev/kneetest.py OUTDIR"""
import sys, pathlib
from playwright.sync_api import sync_playwright
out=pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
root=pathlib.Path(__file__).resolve().parent.parent
url=(root/'index.html').as_uri()
errs=[]; fails=[]
def check(cond, msg):
    print(('PASS ' if cond else 'FAIL ')+msg)
    if not cond: fails.append(msg)

with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={'width':412,'height':860}, device_scale_factor=2, has_touch=True, is_mobile=True, color_scheme='dark')
    pg=ctx.new_page()
    pg.on('pageerror', lambda e: errs.append('pageerror: '+str(e)))
    pg.on('console', lambda m: errs.append('console: '+m.text) if m.type=='error' else None)

    # --- 1. a v2 user who was on step-down (v2 rung 4) and pogo hops (toe rung 4)
    pg.goto(url)
    pg.evaluate("""()=>{ localStorage.clear(); localStorage.setItem('sturdy.onboarded','true'); localStorage.setItem('sturdy.progv','2');
      localStorage.setItem('sturdy.levels', JSON.stringify({knee:4, toe:4, calf:2}));
      localStorage.setItem('sturdy.history', JSON.stringify([{d:'2026-10-19',id:'lowerA',title:'Rehab A: Knee & Hip',mins:34}]));
      localStorage.setItem('sturdy.sound', JSON.stringify('mute')); }""")
    pg.reload(); pg.wait_for_timeout(500)
    pg.screenshot(path=str(out/'01-whatsnew.png'))
    check(pg.evaluate("document.querySelector('.modal h2, #modal h2') && document.querySelector('.modal h2, #modal h2').textContent")=='New knee plan', "what's-new modal shows")
    check(pg.evaluate("lvl('knee')")==0, 'knee restarts at stage 1 rung 1')
    check(pg.evaluate("lvl('toe')")==3, 'toe capped below pogo hops')
    check(pg.evaluate("store.get('progv')")==3, 'progv is 3')
    pg.click('#wn-go'); pg.wait_for_timeout(300)

    # --- 2. kit stand-in: rung 2 without the heavy band
    pg.evaluate("levels.knee=1; store.set('levels',levels); render()")
    check(pg.evaluate("curDef('knee').n")=='Wall sit, 90° hold', 'no band -> wall sit stand-in')
    pg.evaluate("kit.heavyband=true; store.set('kit',kit); render()")
    check(pg.evaluate("curDef('knee').n")=='Spanish squat hold', 'band ticked -> Spanish squat hold')
    check(pg.evaluate("buildSteps('lowerB').steps.some(s=>s.name==='Spanish squat hold')"), 'session uses the Spanish squat hold')
    pg.evaluate("kit.heavyband=false; store.set('kit',kit); levels.knee=2; store.set('levels',levels); render()")

    # --- 3. finish a session rated Easy: rung must NOT move yet
    pg.evaluate("startSession('lowerB')"); pg.wait_for_timeout(400)
    pg.evaluate("finishSession(true)"); pg.wait_for_timeout(500)
    pg.screenshot(path=str(out/'02-finish.png'))
    pg.click('.fb-row[data-slot="knee"] [data-fb="up"]')
    pg.click('#fb-close'); pg.wait_for_timeout(300)
    check(pg.evaluate("lvl('knee')")==2, 'Easy alone does not level the knee')
    check(pg.evaluate("kneeGate.pending && kneeGate.pending.rating")=='up', 'pending morning check stored')
    check(pg.evaluate("document.getElementById('gate-card').hidden"), 'no morning card on the same day')

    # simulate "next morning": move the pending session back a day
    def next_morning():
        pg.evaluate("kneeGate.pending.d=isoOffset(-1); saveGate(); render()")
    next_morning(); pg.wait_for_timeout(200)
    pg.screenshot(path=str(out/'03-morning-card.png'))
    check(not pg.evaluate("document.getElementById('gate-card').hidden"), 'morning card shows next day')
    pg.click('[data-gate="ok"]'); pg.wait_for_timeout(200)
    check(pg.evaluate("lvl('knee')")==2 and pg.evaluate("kneeGate.passes")==1, '1 settled morning: hold, passes=1')
    pg.screenshot(path=str(out/'04-settled-1.png'))

    # second Easy + settled -> up
    pg.evaluate("kneeSessionDone('up')"); next_morning()
    pg.click('[data-gate="ok"]'); pg.wait_for_timeout(200)
    check(pg.evaluate("lvl('knee')")==3, '2 settled mornings + Easy: up a rung')
    check(pg.evaluate("kneeGate.passes")==0, 'passes reset after level-up')
    pg.screenshot(path=str(out/'05-levelled.png'))

    # Right rating + settled: hold even after 2 passes
    pg.evaluate("kneeSessionDone('keep')"); next_morning(); pg.click('[data-gate="ok"]')
    pg.evaluate("kneeSessionDone('keep')"); next_morning(); pg.click('[data-gate="ok"]'); pg.wait_for_timeout(200)
    check(pg.evaluate("lvl('knee')")==3, '"Right" twice stays on the rung')
    pg.evaluate("kneeSessionDone('up')"); next_morning(); pg.click('[data-gate="ok"]'); pg.wait_for_timeout(200)
    check(pg.evaluate("lvl('knee')")==4, 'then Easy + settled moves up (streak already met)')

    # sore next morning -> down a rung
    pg.evaluate("kneeSessionDone('up')"); next_morning(); pg.click('[data-gate="sore"]'); pg.wait_for_timeout(200)
    check(pg.evaluate("lvl('knee')")==3, 'still sore: down a rung')
    # worse -> down a rung + knee mode offer
    pg.evaluate("kneeSessionDone('keep')"); next_morning(); pg.click('[data-gate="worse"]'); pg.wait_for_timeout(200)
    check(pg.evaluate("lvl('knee')")==2, 'worse: down a rung')
    pg.screenshot(path=str(out/'06-worse.png'))
    check(pg.evaluate("!!document.getElementById('gc-km')"), 'worse offers knee mode')
    pg.click('#gc-km'); pg.wait_for_timeout(200)
    check(pg.evaluate("!!kneeMode"), 'knee mode turns on')
    check(pg.evaluate("document.getElementById('gate-card').hidden"), 'gate card hidden in knee mode')
    check(not pg.evaluate("buildSteps('lowerB').slots.includes('knee')"), 'knee slot not rated in knee mode')
    pg.evaluate("endKneeMode(false)")

    # Hard rating drops immediately, then settled morning counts as 1
    pg.evaluate("levels.knee=5; store.set('levels',levels); kneeSessionDone('down')")
    check(pg.evaluate("lvl('knee')")==4, 'Hard drops a rung immediately')
    next_morning(); pg.click('[data-gate="sore"]'); pg.wait_for_timeout(200)
    check(pg.evaluate("lvl('knee')")==4, 'sore after Hard: no double drop')

    # stage-1 rung needs 3 passes
    pg.evaluate("levels.knee=0; store.set('levels',levels); kneeGate.passes=0; saveGate()")
    for i in range(2):
        pg.evaluate("kneeSessionDone('up')"); next_morning(); pg.click('[data-gate="ok"]')
    check(pg.evaluate("lvl('knee')")==0, 'stage 1: 2 passes not enough')
    pg.evaluate("kneeSessionDone('up')"); next_morning(); pg.click('[data-gate="ok"]'); pg.wait_for_timeout(200)
    check(pg.evaluate("lvl('knee')")==1, 'stage 1: 3rd pass moves up')

    # missed check lapses
    pg.evaluate("kneeSessionDone('up'); kneeGate.pending.d=isoOffset(-4); saveGate(); render()")
    check(pg.evaluate("kneeGate.pending===null") and pg.evaluate("document.getElementById('gate-card').hidden"), 'check missed for 3+ days lapses')

    # --- 4. toe spring gate
    pg.evaluate("levels.toe=TOE_SPRING-1; levels.knee=3; store.set('levels',levels); render()")
    pg.evaluate("startSession('lowerC')"); pg.wait_for_timeout(300); pg.evaluate("finishSession(true)"); pg.wait_for_timeout(300)
    has_toe=pg.evaluate("!!document.querySelector('.fb-row[data-slot=\"toe\"]')")
    if has_toe:
        pg.click('.fb-row[data-slot="toe"] [data-fb="up"]')
    pg.click('#fb-close'); pg.wait_for_timeout(200)
    check(has_toe and pg.evaluate("lvl('toe')")==pg.evaluate("TOE_SPRING-1"), 'toe held below pogo while knee < gate')
    pg.evaluate("levels.knee=KNEE_SPRING; store.set('levels',levels); kneeGate.pending=null; saveGate()")
    pg.evaluate("startSession('lowerC')"); pg.wait_for_timeout(300); pg.evaluate("finishSession(true)"); pg.wait_for_timeout(300)
    pg.click('.fb-row[data-slot="toe"] [data-fb="up"]'); pg.click('#fb-close'); pg.wait_for_timeout(200)
    check(pg.evaluate("lvl('toe')")==pg.evaluate("TOE_SPRING"), 'toe moves to pogo once knee reaches the gate')

    # --- 5. library view
    pg.evaluate("levels.knee=6; kneeGate.passes=1; store.set('levels',levels); saveGate(); render()")
    pg.click('nav [data-scr="library"]'); pg.wait_for_timeout(300)
    pg.evaluate("document.querySelector('#lib-ladders details').open=true"); pg.wait_for_timeout(200)
    pg.screenshot(path=str(out/'07-library.png'), full_page=True)
    check(pg.evaluate("document.querySelectorAll('#lib-ladders details')[0].querySelectorAll('.stage-h').length")==4, 'library shows 4 stage headers')

    # --- 6. restoring a v2 backup remaps from v2, not v1
    pg.evaluate("""applyBackup({levels:{knee:5, toe:5, calf:3}, history:[], pain:[], progv:2})""")
    pg.wait_for_timeout(200)
    check(pg.evaluate("lvl('knee')")==0 and pg.evaluate("lvl('calf')")==3, 'v2 backup: knee restarts, calf untouched')

    # --- 7. every new rung has an animation
    missing=pg.evaluate("""(()=>{const m=[]; LADDERS.knee.levels.forEach(v=>{ if(!MOVES[v.n]) m.push(v.n); if(v.alt && !MOVES[v.alt.n]) m.push(v.alt.n); }); return m;})()""")
    check(not missing, 'all knee rungs animated '+str(missing))
    b.close()

for e in errs: print('ERR', e)
print('FAILURES:', len(fails), '| page errors:', len(errs))

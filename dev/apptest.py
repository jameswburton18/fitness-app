"""End-to-end smoke test of the app at Pixel 8 size. usage: python3 dev/apptest.py OUTDIR"""
import sys, pathlib, json
from playwright.sync_api import sync_playwright
out=pathlib.Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
root=pathlib.Path(__file__).resolve().parent.parent
url=(root/'index.html').as_uri()
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={'width':412,'height':860}, device_scale_factor=2, has_touch=True, is_mobile=True, color_scheme=(sys.argv[3] if len(sys.argv)>3 else 'dark'))
    pg=ctx.new_page()
    pg.on('pageerror', lambda e: errs.append('pageerror: '+str(e)))
    pg.on('console', lambda m: errs.append('console: '+m.text) if m.type=='error' else None)
    # existing-user data so the migration/what's-new modal doesn't show
    pg.goto(url)
    pg.evaluate("""()=>{ localStorage.clear(); localStorage.setItem('sturdy.onboarded','true'); localStorage.setItem('sturdy.progv','2');
      localStorage.setItem('sturdy.history', JSON.stringify([{d:'2026-09-21',id:'lowerA',title:'Rehab A: Knee & Hip',mins:34}]));
      localStorage.setItem('sturdy.sound', JSON.stringify('mute')); }""")
    pg.reload(); pg.wait_for_timeout(400)
    pg.screenshot(path=str(out/'01-today.png'))
    sid=sys.argv[2] if len(sys.argv)>2 else 'lowerA'
    pg.evaluate(f"startSession('{sid}')"); pg.wait_for_timeout(900)
    pg.screenshot(path=str(out/'02-first.png'))
    # advance through steps capturing each distinct phase
    seen=set(); n=3
    for i in range(60):
        ph=pg.evaluate("phase"); kind=pg.evaluate("steps[stepIx] && steps[stepIx].kind")
        key=ph
        if key not in seen:
            seen.add(key); pg.wait_for_timeout(700); pg.screenshot(path=str(out/f'{n:02d}-{key}.png')); n+=1
            if key=='run':
                pg.click('#p-primary'); pg.wait_for_timeout(400); pg.screenshot(path=str(out/f'{n:02d}-paused.png')); n+=1
                pg.click('#p-primary'); pg.wait_for_timeout(200)
        if len(seen)>=4: break
        if ph=='ready': pg.click('#p-primary'); pg.wait_for_timeout(250)
        else: pg.click('#p-skip' if ph!='reps' else '#p-primary'); pg.wait_for_timeout(250)
    # left-side flip check: find a left-side step
    pg.evaluate("""()=>{ const i=steps.findIndex(s=>s.side==='Left'); if(i>=0){ stepIx=i; showStep({dir:'f'}); } }"""); pg.wait_for_timeout(700)
    pg.screenshot(path=str(out/f'{n:02d}-leftside.png')); n+=1
    pg.click('#p-quit'); pg.wait_for_timeout(500)
    pg.screenshot(path=str(out/f'{n:02d}-endsheet.png')); n+=1
    pg.click('#end-log'); pg.wait_for_timeout(1200)
    pg.screenshot(path=str(out/f'{n:02d}-finish.png')); n+=1
    pg.click('#fb-close'); pg.wait_for_timeout(500)
    pg.click('nav button[data-scr=library]'); pg.wait_for_timeout(400)
    pg.click('#lib-ladders details summary'); pg.wait_for_timeout(300)
    pg.click('#lib-ladders .rung .play'); pg.wait_for_timeout(900)
    pg.screenshot(path=str(out/f'{n:02d}-demo.png')); n+=1
    hist=pg.evaluate("JSON.parse(localStorage.getItem('sturdy.history')).length")
    print('history entries', hist)
    b.close()
for e in errs: print('ERR', e)
print('done')

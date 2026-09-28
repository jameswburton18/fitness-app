"""Render a contact sheet of figure animations to PNG.
usage: python3 dev/shoot.py OUT.png [--parts a,b] [--flip] [--mid] [name|name|...]
Each row = one move, each cell = one keyframe."""
import sys, pathlib, urllib.parse
from playwright.sync_api import sync_playwright
args=sys.argv[1:]
out=args.pop(0)
parts=''; flip=False; mid=False
if '--parts' in args:
    i=args.index('--parts'); parts=args[i+1]; del args[i:i+2]
if '--flip' in args: args.remove('--flip'); flip=True
if '--mid' in args: args.remove('--mid'); mid=True
names='|'.join(args)
root=pathlib.Path(__file__).resolve().parent
url=(root/'sheet.html').as_uri()+'?'+urllib.parse.urlencode({'m':names,'parts':parts,'flip':'1' if flip else '0','mid':'1' if mid else ''})
with sync_playwright() as p:
    b=p.chromium.launch()
    pg=b.new_page(viewport={'width':1340,'height':400}, device_scale_factor=1)
    errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.goto(url)
    pg.wait_for_function("document.title==='ready'", timeout=15000)
    pg.screenshot(path=out, full_page=True)
    b.close()
    for e in errs: print('ERR', e)
print('ok', out)

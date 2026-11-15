import json, re, sys
w = json.load(open(sys.argv[1]))['parse']['wikitext']['*']
start = w.find('====Denotation notes====')
lines = w[start:].split('\n')
cal = None
out = []

def cell(s):
    s = s[1:] if s.startswith('|') else s
    # drop attribute part "style=... |"
    if '[[' not in s and '|' in s:
        s = s.split('|')[-1]
    return s.strip()

def num(s):
    s = re.sub(r'<[^>]+>', '', cell(s))
    mm = re.search(r'-?\d+', s)
    return int(mm.group()) if mm else None

i = 0
while i < len(lines):
    l = lines[i]
    if l.startswith('|-'):
        m = re.search(r'id="(.+?)_anchor"', l)
        j = i + 1
        if m:
            cal = m.group(1).replace('_', ' ')
            j += 1  # skip caliber cell
        if j < len(lines):
            m2 = re.search(r'\[\[([^\]|]+)(?:\|([^\]]+))?\]\]', lines[j])
            if m2 and cal and lines[j].startswith('|'):
                name = m2.group(2) or m2.group(1)
                dmg_line = lines[j + 1]
                dmg_raw = cell(dmg_line)
                pen = num(lines[j + 2])
                dmg = num(dmg_line)
                pellets = re.search(r'(\d+)\s*x\s*(\d+)', dmg_raw)
                out.append(dict(caliber=cal, name=name, dmg=dmg, pellets=dmg_raw if pellets else None, pen=pen,
                                tracer='<sup>T</sup>' in lines[j], subsonic='<sup>S</sup>' in lines[j]))
    i += 1
json.dump(out, open(sys.argv[2], 'w'), indent=1)
from collections import Counter
print(len(out)); print(Counter(o['caliber'] for o in out))
for o in out[:3] + [x for x in out if x['caliber'] == '12/70'][:3] + out[-3:]:
    print(o)

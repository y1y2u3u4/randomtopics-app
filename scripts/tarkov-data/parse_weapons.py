import json, re, sys
from collections import Counter

w = json.load(open(sys.argv[1]))['parse']['wikitext']['*']
out = []
h2 = h3 = None
lines = w.split('\n')
i = 0
while i < len(lines):
    l = lines[i]
    m = re.match(r'^(=+)\s*(.*?)\s*=+\s*$', l)
    if m:
        if len(m.group(1)) == 2:
            h2 = m.group(2); h3 = None
        else:
            h3 = m.group(2)
    if l.strip() == '|-' and i + 3 < len(lines):
        name = lines[i + 1]; img = lines[i + 2]
        nm = re.match(r'^\|\s*\[\[([^\]|]+)(?:\|([^\]]+))?\]\]', name)
        if nm and img.startswith('!'):
            cells = []
            j = i + 3
            while j < len(lines) and lines[j].startswith('|') and not lines[j].startswith('|-') and not lines[j].startswith('|}'):
                cells.append(lines[j][1:]); j += 1
            imgf = re.search(r'File:([^|\]]+)', img)
            out.append(dict(section=h2, cls=h3, page=nm.group(1), name=nm.group(2) or nm.group(1), cells=cells, img=imgf.group(1) if imgf else None))
    i += 1
json.dump(out, open(sys.argv[2], 'w'), indent=1)
print(len(out))
for k, v in Counter((o['section'], o['cls']) for o in out).items():
    print(v, k)

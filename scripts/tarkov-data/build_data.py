"""Build tarkov weapon/ammo dataset + download weapon renders (wiki thumbnails).
usage: python3 build_data.py <tmpdir> <repo>"""
import json, re, sys, os, urllib.request, urllib.parse, subprocess

tmp, repo = sys.argv[1], sys.argv[2]
raw = json.load(open(f'{tmp}/weapons_raw.json'))
ammo_raw = json.load(open(f'{tmp}/ammo_raw.json'))
UA = {'User-Agent': 'Mozilla/5.0 (RandomTopics data build)'}

CLASS = {
    ('Primary weapons', 'Assault carbines'): 'carbine',
    ('Primary weapons', 'Assault rifles'): 'ar',
    ('Primary weapons', 'Bolt-action rifles'): 'bolt',
    ('Primary weapons', 'Designated marksman rifles'): 'dmr',
    ('Primary weapons', 'Grenade launchers'): 'gl',
    ('Primary weapons', 'Light machine guns'): 'lmg',
    ('Primary weapons', 'Shotguns'): 'shotgun',
    ('Primary weapons', 'Submachine guns'): 'smg',
    ('Secondary weapons', 'Pistols'): 'pistol',
    ('Secondary weapons', 'Revolvers'): 'revolver',
    ('Secondary weapons', 'Shotguns'): 'shotgun',
    ('Melee weapons', None): 'melee',
}

def clean(s):
    s = re.sub(r'data-sort-value="[^"]*"\s*\|', '', s)
    s = re.sub(r'\[\[(?:[^\]|]*\|)?([^\]]+)\]\]', r'\1', s)
    s = re.sub(r'<br\s*/?>', ' ', s)
    s = re.sub(r'<hr\s*/?>', ' / ', s)
    s = re.sub(r'<[^>]+>', '', s)
    s = s.replace('‑', '-').replace('﻿', '').replace("'''", '').replace("''", '')
    return re.sub(r'\s+', ' ', s).strip(' |')

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

weapons = []
for o in raw:
    c = CLASS.get((o['section'], o['cls']))
    if not c:
        continue
    cells = o['cells']
    w = dict(id=slug(o['name']), name=o['name'].strip(), cls=c, wiki=o['page'], img=o['img'])
    if c == 'melee':
        w['caliber'] = None
    else:
        w['caliber'] = clean(cells[0]) if cells else None
        w['modes'] = clean(cells[1]) if len(cells) > 1 else ''
        try:
            w['rof'] = int(re.sub(r'\D', '', clean(cells[2])) or 0)
        except Exception:
            w['rof'] = 0
    weapons.append(w)

# drop quest/meme-only items that aren't real raid picks
SKIP = {'blicky'}
weapons = [w for w in weapons if w['id'] not in SKIP]
# de-dupe ids
seen = set()
for w in weapons:
    while w['id'] in seen:
        w['id'] += '-2'
    seen.add(w['id'])

ammo = []
for a in ammo_raw:
    dmg, pellets = a['dmg'], None
    if a['pellets']:
        m = re.search(r'(\d+)\s*x\s*(\d+)', a['pellets'])
        pellets, dmg = int(m.group(1)), int(m.group(2))
    ammo.append(dict(caliber=a['caliber'], name=a['name'], dmg=dmg, pellets=pellets, pen=a['pen'], tracer=a['tracer'], subsonic=a['subsonic']))

cals = {a['caliber'] for a in ammo}
missing = sorted({w['caliber'] for w in weapons if w['caliber'] and w['caliber'] not in cals})
print('weapons', len(weapons), 'ammo', len(ammo), 'calibers without ammo:', missing)

# images: imageinfo thumbnails
outdir = f'{repo}/public/tarkov/weapons'
os.makedirs(outdir, exist_ok=True)
files = [w for w in weapons if w['img']]
urls = {}
for i in range(0, len(files), 40):
    batch = files[i:i + 40]
    titles = '|'.join('File:' + w['img'].strip() for w in batch)
    q = urllib.parse.urlencode(dict(action='query', titles=titles, prop='imageinfo', iiprop='url', iiurlwidth=360, format='json'))
    d = json.load(urllib.request.urlopen(urllib.request.Request('https://escapefromtarkov.fandom.com/api.php?' + q, headers=UA), timeout=60))
    norm = {n['to']: n['from'] for n in d['query'].get('normalized', [])}
    for p in d['query']['pages'].values():
        ii = p.get('imageinfo')
        if ii:
            urls[norm.get(p['title'], p['title'])] = ii[0].get('thumburl') or ii[0]['url']
ok = 0
for w in files:
    u = urls.get('File:' + w['img'].strip())
    dest = f'{outdir}/{w["id"]}.webp'
    if not u:
        w['img'] = None; continue
    if not os.path.exists(dest):
        src = f'{tmp}/img_{w["id"]}'
        try:
            data = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60).read()
            open(src, 'wb').write(data)
            if data[:4] == b'RIFF':
                subprocess.run(['dwebp', '-quiet', src, '-png', '-o', src + '.png'], check=True)
                src = src + '.png'
            subprocess.run(['cwebp', '-quiet', '-q', '72', '-resize', '320', '0', src, '-o', dest], check=True)
        except Exception as e:
            print('fail', w['id'], e); w['img'] = None; continue
    w['img'] = True; ok += 1
for w in weapons:
    if w['img'] is not True:
        w['img'] = False
print('images', ok)
json.dump(dict(weapons=weapons, ammo=ammo), open(f'{tmp}/tarkov_data.json', 'w'), indent=1)

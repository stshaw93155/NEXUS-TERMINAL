import urllib.request, re, json, time

countries = {
    'JP': 'Japan', 'GB': 'UK', 'FR': 'France', 'RU': 'Russia',
    'BR': 'Brazil', 'US': 'USA', 'DE': 'Germany', 'KR': 'South Korea',
    'IT': 'Italy', 'ES': 'Spain'
}

cameras = []
cam_id = 1

for cc, name in countries.items():
    url = f'http://www.insecam.org/en/bycountry/{cc}/'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8')
        matches = list(set(re.findall(r'src="(http://[0-9\.]+:\d+/mjpg/video\.mjpg.*?|http://[0-9\.]+:\d+/axis-cgi/mjpg/video\.cgi.*?|http://[0-9\.]+:\d+/video\.mjpg.*?)"', html)))
        
        for i, mjpeg in enumerate(matches[:10]):
            cameras.append({
                'id': f'cctv-{cc.lower()}-{i+1}',
                'name': f'{name} Cam {i+1}',
                'mjpeg': mjpeg,
                'country': cc
            })
    except Exception as e:
        print(f"Failed for {cc}: {e}")
    time.sleep(1)

with open('src/data/world_cameras.js', 'w') as f:
    f.write("export const WORLD_CAMERAS = " + json.dumps(cameras, indent=2) + ";\n")

print(f"Saved {len(cameras)} cameras.")

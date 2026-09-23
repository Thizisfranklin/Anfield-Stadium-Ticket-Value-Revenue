"""Download public sources; preserve hashes without republishing club PDF artwork."""
import hashlib
import json
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCES = {
    'ticketing-2024-25.pdf': 'https://drive.google.com/uc?export=download&id=1eS8BnI8QpBdjSiwhaVb3Vh-vuqTFlVef',
    'ticketing-2025-26.pdf': 'https://drive.google.com/uc?export=download&id=10GcbSS106KbP7nbyPy-T0ONkCeqfsGMU',
    'fixtures-2425.csv': 'https://www.football-data.co.uk/mmz4281/2425/E0.csv',
    'fixtures-2526.csv': 'https://www.football-data.co.uk/mmz4281/2526/E0.csv',
    'access-2026.pdf': 'https://backend.liverpoolfc.com/sites/default/files/2026-03/Access_Statement_-_LATEST__March_5a6934336def9e01eeef96e550620350.pdf',
    'prices-2026-27.webp': 'https://contentfulproxy.stadion.io/rm6ms1yxue4m/6urmetpVhkTC2F4sUe38Bx/10f171bd080e1ebe5ba8aa93595d76c7/2026-2027_Anfield_Ticket_Prices-PL_mbm_.jpg',
}

def main():
    raw = ROOT/'data/raw'
    raw.mkdir(parents=True, exist_ok=True)
    manifest = []
    for name, url in SOURCES.items():
        path = raw/name
        if not path.exists():
            with urllib.request.urlopen(url, timeout=90) as response:
                path.write_bytes(response.read())
        content = path.read_bytes()
        if name.endswith('.pdf') and not content.startswith(b'%PDF'):
            raise ValueError(f'{name}: expected PDF, received something else')
        manifest.append(dict(file=name,url=url,accessed_utc=datetime.now(timezone.utc).isoformat(),
                             sha256=hashlib.sha256(content).hexdigest(),bytes=len(content)))
        print(name, len(content))
    (ROOT/'data/source_manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')

if __name__ == '__main__': main()

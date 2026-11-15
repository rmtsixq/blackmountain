"""Checks that every key in src/lib/tr.ts is text the app actually uses.

The Turkish dictionary is keyed by the English string. If the English changes
and the key does not, the Turkish silently stops showing. Run after editing
either side:

    python scripts/check_tr.py
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
KEY = re.compile(r"""^  (?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|([A-Za-z]\w*)):""", re.M)


def main() -> int:
    source = (ROOT / "src" / "lib" / "tr.ts").read_text(encoding="utf-8")
    keys = [a or b or c for a, b, c in KEY.findall(source)]

    corpus = "\n".join(
        p.read_text(encoding="utf-8")
        for p in (ROOT / "src").rglob("*.ts*")
        if p.name != "tr.ts"
    )
    manifest = json.loads((ROOT / "public" / "data" / "manifest.json").read_text(encoding="utf-8"))
    corpus += "\n" + json.dumps(manifest, ensure_ascii=False)

    missing = [k for k in keys if k not in corpus]
    for k in missing:
        print("unused or changed:", k[:90].encode("ascii", "backslashreplace").decode())
    print(f"{len(keys)} keys, {len(missing)} not found")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())

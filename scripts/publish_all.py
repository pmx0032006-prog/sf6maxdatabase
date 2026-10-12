"""SF6 MAX DATABASE: build check -> commit -> push (run on Doc's PC).

Order: safety scan -> next build -> confirm -> git add/commit -> git push origin main.
Nothing is committed or pushed unless the build succeeds.
"""
import fnmatch
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRANCH = "main"
REMOTE = "origin"
MAX_MB = 50

# Only these go up. Everything else (private scripts, notes, tmp files) is left alone.
INCLUDE_PREFIXES = ("src/", "public/")
INCLUDE_FILES = {"scripts/add-yasmine.py", "scripts/publish_all.py", "scripts/run-yasmine.bat"}

BLOCK_PATTERNS =[".env", ".env.*", "*.pem", "*.key", "id_rsa*", "*.pfx", "*secret*", "*credentials*"]
ALLOW_PATTERNS = [".env.example", ".env.sample"]

COMMIT_SUBJECT = "SF6 MAX DATABASE: Yasmine desk layout, back-to-top, panel fit, larger text, remove AdSense placeholder"
COMMIT_BODY = (
    "- Yasmine desk layout: clickable title returns to top, mobile back button, panel fits 1440x800\n"
    "- Raise sub-12px text sitewide, hide AdSense placeholder slot\n\n"
    "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>\n"
    "Claude-Session: https://claude.ai/code/session_01QDkcJ11WMhs2HiRUgEvnAJ"
)


def run(cmd, check=True, capture=False):
    print(f"> {cmd}")
    r = subprocess.run(cmd, cwd=REPO, shell=True, text=True, encoding="utf-8",
                       errors="replace", capture_output=capture)
    if check and r.returncode != 0:
        if capture:
            print(r.stdout or "", r.stderr or "")
        sys.exit(f"[中止] コマンド失敗 (code {r.returncode}): {cmd}")
    return r


def main():
    print("=== SF6 MAX DATABASE 公開 ===")
    br = run("git rev-parse --abbrev-ref HEAD", capture=True).stdout.strip()
    if br != BRANCH:
        sys.exit(f"[中止] ブランチが {br} です。{BRANCH} で実行してください")

    st = run("git status --porcelain", capture=True).stdout.splitlines()
    if not st:
        sys.exit("変更なし。あげるものがありません")
    paths = [line[3:].strip().strip('"') for line in st]
    print(f"変更ファイル: {len(paths)} 件")

    bad = []
    for p in paths:
        if not (p.startswith(INCLUDE_PREFIXES) or p in INCLUDE_FILES):
            continue  # not going up anyway
        base = os.path.basename(p.rstrip("/"))
        if any(fnmatch.fnmatch(base.lower(), a) for a in ALLOW_PATTERNS):
            continue
        if any(fnmatch.fnmatch(base.lower(), b) for b in BLOCK_PATTERNS):
            bad.append(p)
        full = os.path.join(REPO, p)
        if os.path.isfile(full) and os.path.getsize(full) > MAX_MB * 1024 * 1024:
            bad.append(f"{p} (>{MAX_MB}MB)")
    if bad:
        print("[中止] 上げてはいけない可能性があるファイルがあります:")
        for b in bad:
            print("  -", b)
        sys.exit("これらを外すか .gitignore に入れてから、もう一度実行してください")

    include, exclude = [], []
    for p in paths:
        p = p.split(" -> ")[-1].strip().strip('"')
        if p.startswith(INCLUDE_PREFIXES) or p in INCLUDE_FILES:
            include.append(p)
        else:
            exclude.append(p)
    print(f"\n[上げる] {len(include)} 件 (src/ public/ と指定ファイル)")
    print(f"[上げない] {len(exclude)} 件 (対象外。必要なら別途)")
    for p in exclude[:40]:
        print("   skip:", p)
    if len(exclude) > 40:
        print(f"   ... ほか {len(exclude) - 40} 件")
    if not include:
        sys.exit("上げる対象がありません")

    print("\n--- next build（数分かかります）---")
    run("npm run build")
    print("\nbuild 成功。")

    ans = input(f"{len(include)} 件を {REMOTE}/{BRANCH} に push します（公開サイトに反映される可能性あり）。よいですか？ y/N: ")
    if ans.strip().lower() != "y":
        sys.exit("中止しました（何も commit していません）")

    quoted = " ".join(f'"{p}"' for p in include)
    run(f"git add -A -- {quoted}")
    run(f'git commit -m "{COMMIT_SUBJECT}" -m "{COMMIT_BODY.replace(chr(34), chr(39))}"')
    run(f"git push {REMOTE} {BRANCH}")
    print("\n=== 完了: push しました ===")


if __name__ == "__main__":
    main()

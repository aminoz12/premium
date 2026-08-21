#!/usr/bin/env python3
"""Compress video files in a folder while keeping the same file name and extension.

Usage:
    python resize.py "C:/path/to/videos"
    python resize.py . --max-width 960 --crf 26
"""

from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path

SUPPORTED_EXTENSIONS = {".mp4"}


def find_video_files(root: Path):
    for path in sorted(root.rglob("*")):
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS:
            yield path


def compress_video(input_path: Path, output_path: Path, max_width: int, crf: int, audio_bitrate: str) -> None:
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(input_path),
        "-vf",
        f"scale='min({max_width},iw)':-2:flags=lanczos",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        str(crf),
        "-c:a",
        "aac",
        "-b:a",
        audio_bitrate,
        str(output_path),
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        stderr = (result.stderr or "").strip()
        raise RuntimeError(f"Failed to compress {input_path.name}: {stderr}")


def process_video(path: Path, max_width: int, crf: int, audio_bitrate: str) -> None:
    temp_output = path.with_name(f"{path.stem}_compressed{path.suffix}")
    backup_path = path.with_suffix(path.suffix + ".bak")

    if temp_output.exists():
        temp_output.unlink()
    if backup_path.exists():
        backup_path.unlink()

    os.replace(path, backup_path)

    try:
        compress_video(backup_path, temp_output, max_width=max_width, crf=crf, audio_bitrate=audio_bitrate)
        os.replace(temp_output, path)
    except Exception:
        if temp_output.exists():
            temp_output.unlink()
        if backup_path.exists():
            os.replace(backup_path, path)
        raise
    else:
        if backup_path.exists():
            backup_path.unlink()


def main() -> int:
    parser = argparse.ArgumentParser(description="Compress video files in place while preserving names and extensions")
    parser.add_argument("folder", nargs="?", default=".", help="Folder containing videos (default: current folder)")
    parser.add_argument("--max-width", type=int, default=1280, help="Maximum width for the output video (default: 1280)")
    parser.add_argument("--crf", type=int, default=28, help="FFmpeg quality CRF (lower = better quality, default: 28)")
    parser.add_argument("--audio-bitrate", default="128k", help="Audio bitrate for the compressed video (default: 128k)")
    args = parser.parse_args()

    root = Path(args.folder).resolve()
    if not root.exists() or not root.is_dir():
        print(f"Folder not found: {root}", file=sys.stderr)
        return 1

    videos = list(find_video_files(root))
    if not videos:
        print(f"No video files found in {root}")
        return 0

    print(f"Found {len(videos)} video file(s) in {root}")
    for video_path in videos:
        print(f"Compressing: {video_path}")
        process_video(video_path, max_width=args.max_width, crf=args.crf, audio_bitrate=args.audio_bitrate)
        print(f"Done: {video_path}")

    print("Compression complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

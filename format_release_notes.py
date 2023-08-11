#!/usr/bin/env python3
import re


def main():
    with open("docs/reference/releases.md", "r", encoding="utf8") as f:
        lines = f.readlines()

    for i, line in enumerate(lines):
        m = re.match(r"### ((New Feature|Bug|Task|Improvement).*)", line)
        if m:
            line = "- " + m.group(1)

        m = re.match(r"(\[RCSS-\d+\])\(http.*\) (.*)\n", line)
        if m:
            line = "  - " + m.group(1) + " " + m.group(2)

        lines[i] = line

    with open("docs/reference/releases.md", "w", encoding="utf8") as f:
        f.writelines(lines)


if __name__ == "__main__":
    main()

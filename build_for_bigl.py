#!/usr/bin/env python3

import re
import os
import subprocess
import sys


def exec(cmd: str, debug=False):
    print("> " + cmd)
    if not debug:
        try:
            subprocess.run(cmd, shell=True, check=True)
        except subprocess.CalledProcessError as e:
            print("error: " + str(e))
            sys.exit(e.returncode)


def modify():
    for d, dirs, files in os.walk("docs/.vuepress/dist"):
        for filename in files:
            if filename.endswith(".html") or filename.endswith(".js"):
                full_name = f"{d}/{filename}"
                print(full_name)

                txt = ""
                new_txt = ""
                with open(full_name, "r", encoding="utf8") as f:
                    txt = f.read()

                new_txt = txt
                new_txt = re.sub("Autoxing", "BIGL", new_txt, flags=re.IGNORECASE)
                new_txt = re.sub("景行慧动", "BIGL", new_txt, flags=re.IGNORECASE)
                new_txt = re.sub("axbot", "biglbot", new_txt, flags=re.IGNORECASE)

                if new_txt != txt:
                    print("changed")

                    with open(full_name, "w", encoding="utf8") as f:
                        f.write(new_txt)


exec("npm run docs:build")
modify()
# exec("docker build . -f Dockerfile_bigl -t autoxing/biglbot_rest_book")
exec("rsync -rv docs/.vuepress/dist/* build-pi:/opt/www/biglbot_rest_book/")

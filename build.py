#!/usr/bin/env python3

import subprocess
import sys
import argparse


def exec(cmd: str, debug=False):
    print("> " + cmd)
    if not debug:
        try:
            subprocess.run(cmd, shell=True, check=True)
        except subprocess.CalledProcessError as e:
            print("error: " + str(e))
            sys.exit(e.returncode)


parser = argparse.ArgumentParser()
args = parser.parse_args()

exec("npm run docs:build")
exec("rsync -rv docs/.vuepress/dist/* my-server:/opt/www/axbot_rest_book/")

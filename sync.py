import os


def main():
    src_dir = os.path.dirname(os.path.abspath(__file__))
    dest_dir = os.path.abspath(os.path.join(src_dir, "../axbot_restbook"))

    exclude_dirs = {".vscode", ".git"}

    for root, dirs, files in os.walk(src_dir):
        # Exclude specified directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]

        for file in files:
            src_file = os.path.join(root, file)
            relative_path = os.path.relpath(src_file, src_dir)
            dest_file = os.path.join(dest_dir, relative_path)

            if os.path.exists(dest_file):
                os.makedirs(os.path.dirname(dest_file), exist_ok=True)
                with open(src_file, "rb") as fsrc, open(dest_file, "wb") as fdst:
                    fdst.write(fsrc.read())


if __name__ == "__main__":
    main()

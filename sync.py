import os

blacklist = {
    ".vscode",
    ".git",
    "__pycache__",
    "docs/reference/recordings.md",
    "docs/reference/videos.md",
    "docs/reference/bags.md",
}

permitted_extensions = {".md", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".mp4"}

target_folder = "../axbot_restbook"


def main():
    src_dir = os.path.dirname(os.path.abspath(__file__))
    dest_dir = os.path.abspath(os.path.join(src_dir, target_folder))

    for root, dirs, files in os.walk(src_dir):
        # Exclude specified directories
        dirs[:] = [d for d in dirs if d not in blacklist]

        for file in files:
            src_file = os.path.join(root, file)
            relative_path = os.path.relpath(src_file, src_dir)

            # Skip files not in permitted extensions
            if not any(file.endswith(ext) for ext in permitted_extensions):
                continue

            # Skip blacklisted files
            if relative_path in blacklist:
                continue

            dest_file = os.path.join(dest_dir, relative_path)

            # Create destination directory if it doesn't exist
            os.makedirs(os.path.dirname(dest_file), exist_ok=True)

            # Copy file
            with open(src_file, "rb") as fsrc, open(dest_file, "wb") as fdst:
                fdst.write(fsrc.read())


if __name__ == "__main__":
    main()

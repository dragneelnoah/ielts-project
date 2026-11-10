#!/bin/bash

# Define the graph categories
categories=("line" "bar" "pie" "table")

for cat in "${categories[@]}"; do
    target_dir="sample-questions/$cat"

    if [ -d "$target_dir" ]; then
        # Loop through files matching the double prefix pattern (e.g., bar-bar-*)
        for file in "$target_dir"/"$cat"-"$cat"-*; do
            # Skip if no matching files exist
            [ -e "$file" ] || continue

            filename=$(basename "$file")

            # Remove the first instance of the category prefix to fix the double prefix
            newname="${filename#"$cat-"}"

            # Perform the rename
            mv "$file" "$target_dir/$newname"
            echo "Fixed: $filename -> $newname"
        done
    else
        echo "Directory not found: $target_dir"
    fi
done

echo "Filename cleanup complete!"

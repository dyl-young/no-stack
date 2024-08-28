const { execSync } = require("child_process");

try {
  // Get all local tags and their tagger date
  const tags = execSync(
    'git tag --list --format "%(refname:strip=2) %(taggerdate:short)"',
  )
    .toString()
    .split("\n");

  // Debug log to see raw tags output
  console.log("Raw tags output:", tags);

  // Find lightweight (unannotated) tags
  const unannotatedTags = tags
    .filter((tag) => tag.trim() !== "") // Filter out empty lines
    .map((tag) => {
      const parts = tag.split(" ");
      const name = parts[0]; // Tag name
      const date = parts.slice(1).join(" "); // Tagger date (in case of multiple spaces)
      return { name, date };
    })
    .filter((tag) => !tag.date); // Filter out tags with a tagger date

  if (unannotatedTags.length > 0) {
    console.error(
      "Error: The following tags are not annotated:",
      `"${unannotatedTags.map((tag) => tag.name).join('", "')}"`, // Format output
    );
    console.log(
      "\nTo delete a lightweight tag and re-add it as an annotated tag, use the following commands:",
    );
    unannotatedTags.forEach((tag) => {
      console.log(`1. Delete the tag: git tag -d ${tag.name}`);
      console.log(
        `2. Re-add the tag as annotated: git tag -a ${tag.name} -m "Your annotation message"`,
      );
    });
    process.exit(1); // Exit with error
  } else {
    console.log("All tags are annotated.");
  }
} catch (error) {
  console.error("Failed to check tags:", error);
  process.exit(1);
}

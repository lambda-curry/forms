import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const publishablePackages = ["packages/components/package.json"];

const unpublishedPackages = publishablePackages.filter((packagePath) => {
  const localPackage = JSON.parse(readFileSync(packagePath, "utf8"));

  try {
    const exactVersion = execFileSync(
      "npm",
      ["view", `${localPackage.name}@${localPackage.version}`, "version"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();

    return exactVersion !== localPackage.version;
  } catch {
    return true;
  }
});

if (unpublishedPackages.length === 0) {
  console.log("All publishable package versions are already on npm.");
  process.exit(0);
}

execFileSync("yarn", ["changeset", "publish"], { stdio: "inherit" });

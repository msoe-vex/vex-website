import generatorFeatures from "./generateFeatures.ts";

async function runAllScripts() {
    try {
        console.log("Running pre-build scripts...");

        await generatorFeatures();
    } catch (error) {
        console.error("Prebuild script failed: ", error);
        process.exit(1);
    } finally {
        console.log("All prebuild scripts finished!");
    }
}

runAllScripts();
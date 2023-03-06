import fs from "fs";
import _ from "lodash";
import network from "./network.js";

let dataLoaded = false;
let taskFiles = {};
let actionFiles = {};
let cronFiles = {};

let lastCron = undefined;
let lastState = network(JSON.parse(fs.readFileSync("./state.json", {encoding: "utf-8"})));

export default async (req, res) => {

    if (!dataLoaded) {
        taskFiles = await loadCode("./tasks");
        actionFiles = await loadCode("./actions");
        cronFiles = await loadCode("./cron");
        dataLoaded = true;
    }

    if (shouldExecNetFunc(req)) {
        console.log(`Executing automation as: ${JSON.stringify(req.body)} at ${new Date().toString()}`);
        const cleanBody = network(req.body);
        if (req.body.action) {
            delete cleanBody["action"];
            const state = _.cloneDeep(cleanBody["state"]);
            delete cleanBody["state"];
            for (const func in actionFiles) {
                actionFiles[func].default(state, cleanBody);
            }
        } else if (!req.body.action) {
            for (const func in taskFiles) {
                taskFiles[func].default(cleanBody.state, lastState, cleanBody.state.timestamps);
            }
            lastState = cleanBody.state;
        }
    } else {
        const newCron = new Date();
        const lastCronCopy = _.clone(lastCron)
        for (const func of cronFiles) {
            cronFiles[func].default(newCron, lastCronCopy);
        }
        lastCron = newCron;
    }

    res.body = "Query Recieved";
}

const shouldExecNetFunc = (req) => {
    if (!req.method == "POST") {
        return false;
    }
    return true;
}

const loadCode = async (codePath) => {
    const fileNames = fs.readdirSync(codePath);
    const files = {};
    for (const name of fileNames) {
        const sourceRelativeFilePath = `../${codePath}/${name}`;
        files[name] = await import(sourceRelativeFilePath);
    }
    return files;
}
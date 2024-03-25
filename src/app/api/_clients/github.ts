import { Octokit } from "octokit";

const getOctokit = () => {
    if (!process.env.GH_PAT) {
        throw new Error("requires GitHub Personal Access Token to be specified in environment variable GH_PAT")
    }

    return new Octokit({ auth: process.env.GH_PAT })
}

export default getOctokit()
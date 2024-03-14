// Copyright The Linux Foundation and each contributor to CommunityBridge.
// SPDX-License-Identifier: MIT
const AWS = require('aws-sdk');

// @ts-check


/**
 * @param {string[]} variables
 * @param {string} stage
 * @param {string} region
 * @returns {Promise<{ [key:string]: string}>}
 */
async function retrieveSSMValues(variables, stage, region) {
    const scopedVariables = variables.map((param) => `cla-${param}-${stage}`);
    const result = await requestSSMParameters(scopedVariables, stage, region);
    const parameters = result.Parameters;
    const error = result.$response.error;
    if (error !== null) {
        throw new Error(
            `Couldn't retrieve SSM parameters for stage ${stage} in region ${region} - error ${error}`
        );
    }
    const scopedParams = createParameterMap(parameters, stage);
    const params = new Map();
    Object.keys(scopedParams).forEach((key) => {
        const param = scopedParams[key];
        key = key.replace('cla-', '');
        key = key.replace(`-${stage}`, '');
        params[key] = param;
    });

    variables.forEach((variable) => {
        if (params[variable] === undefined) {
            throw new Error(
                `Missing SSM parameter with name ${variable} for stage ${stage} in region ${region}`,
            );
        }
    });

    return params;
}

/**
 * Performs a bulk request of the specified SSM parameters.
 * @param {string[]} variables
 * @param {string} stage
 * @param {string} region
 */
async function requestSSMParameters(variables, stage, region) {
    const ssm = new AWS.SSM({ region });
    const ps = {
        Names: variables,
        WithDecryption: true
    };
    const response = await ssm.getParameters(ps).promise();
    return response;
}

/**
 * @param {AWS.SSM.Parameter[]} parameters
 * @param {string} stage
 */
function createParameterMap(parameters, stage) {
    return parameters.filter((param) => param.Name.endsWith(`-${stage}`))
        .map((param) => {
            const output = {};
            output[param.Name] = param.Value;
            return output;
        })
        .reduce((prev, current) => {
            return { ...prev, ...current };
        }, {});
}

module.exports = retrieveSSMValues;

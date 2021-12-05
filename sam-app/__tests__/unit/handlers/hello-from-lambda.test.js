// Import all functions from hello-from-lambda.js
const AWS = require("aws-sdk");
const lambda = require("../../../src/handlers/hello-from-lambda.js");

const sleep = (secs) =>
  new Promise((resolve) => setTimeout(resolve, 1000 * secs));

/**
 * Get stack name from environment variable AWS_SAM_STACK_NAME and make an API call to verify the stack exists.
 * throw exception if AWS_SAM_STACK_NAME is not set.
 */
const getAndVerifyStackName = async () => {
  const stackName = process.env["AWS_SAM_STACK_NAME"];
  if (!stackName) {
    throw new Error(
      "Cannot find env var AWS_SAM_STACK_NAME.\n" +
        "Please setup this environment variable with the stack name where we are running integration tests."
    );
  }

  const client = new AWS.CloudFormation();
  try {
    await client
      .describeStacks({
        StackName: stackName,
      })
      .promise();
  } catch (e) {
    throw new Error(
      `Cannot find stack ${stackName}: ${e.message}\n` +
        `Please make sure stack with the name "${stackName}" exists.`
    );
  }

  return stackName;
};

// This includes all tests for helloFromLambdaHandler()
describe("Test for hello-from-lambda", function () {
  // This test invokes helloFromLambdaHandler() and compare the result
  it("Verifies successful response", async () => {

    const stackName = await getAndVerifyStackName();

    const client = new AWS.CloudFormation();
    const response = await client
      .listStackResources({
        StackName: stackName,
      })
      .promise();

    const resources = response.StackResourceSummaries;

    const lambdaFunctionResource = resources.find(
      (resource) => resource.LogicalResourceId === "helloFromLambdaFunction"
    );
    expect(
        lambdaFunctionResource
    ).toBeDefined()

    const lambdaFunctionName = lambdaFunctionResource.PhysicalResourceId
    const lambdaClient = new AWS.Lambda()
    const resp = await lambdaClient.invoke({FunctionName: lambdaFunctionName, Payload: JSON.stringify({msg: "hello from jest test"})}).promise()
    expect(JSON.parse(resp.Payload)).toEqual("hello from jest test")
    

    const msg = "hello from local unit test"
    const result = await lambda.helloFromLambdaHandler({msg});
    const expectedResult = msg;
    expect(result).toEqual(expectedResult);
  });
});

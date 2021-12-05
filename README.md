# aws-sam-playground

playground for all things AWS SAM

## Demo

```sh
cd sam-app

sam sync --watch --stack-name sam-app

sam logs --tail

# run tests in `__tests__/`
AWS_SAM_STACK_NAME=sam-app npm run test

aws lambda invoke \
  --cli-binary-format "raw-in-base64-out" \
  --function-name "sam-app-helloFromLambdaFunction-SvAJyAV6zcDN" \
  --payload '{"msg": "hello"}' \
  output.log; cat output.log; rm output.log

```

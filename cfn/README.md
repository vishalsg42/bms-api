# Beslin Event Cloudformation template

- To deploy the cloudformation stack execute the below command
  >$ aws cloudformation deploy --template all-stacks.yml --stack-name beslin-event-service --region ap-south-1 --parameter-overrides ApplicationName=stream-rustic-web-service  --capabilities CAPABILITY_NAMED_IAM --profile vishal-iam

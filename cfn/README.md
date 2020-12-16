# Beslin Event Cloudformation template

- To deploy the cloudformation stack execute the below command
  >$ aws cloudformation deploy --template cfn/application-stack.yml --stack-name <stack-name> --region <aws-region> --parameter-overrides ApplicationName=<application-name> SecretKey=\<secret-key\>  --capabilities CAPABILITY_NAMED_IAM --profile <profile-name>

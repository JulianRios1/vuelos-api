
provider "aws" {
  region = var.aws_region
}

resource "aws_dynamodb_table" "itinerarios_table" {
  name           = "Itinerarios"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "idVuelo"
  
  attribute {
    name = "idVuelo"
    type = "S"
  }
}

resource "aws_lambda_function" "api_lambda" {
  filename         = "../dist/lambda.zip"
  function_name    = "itinerarios-api"
  role            = aws_iam_role.lambda_role.arn
  handler         = "app.handler"
  runtime         = "nodejs20.x"

  environment {
    variables = {
      NODE_ENV = "dev"
      JWT_SECRET = var.jwt_secret
    }
  }
}

resource "aws_apigatewayv2_api" "http_api" {
  name          = "itinerarios-http-api"
  protocol_type = "HTTP"
}

# Vuelos API - Serverless Project

## Descripción
API para gestión de itinerarios de vuelos implementada con arquitectura serverless usando AWS Lambda y API Gateway.

## Tabla de Contenidos
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración](#configuración)
- [Despliegue](#despliegue)
- [Pruebas](#pruebas)
- [Documentación API](#documentación-api)
- [Alternativas de Despliegue](#alternativas-de-despliegue)

## Requisitos Previos

### Herramientas Locales
- Node.js (v20 o superior)
- NPM (v9 o superior)
- AWS CLI configurado
- ExpressJS  Framework (`npm install -g expressjs`)
- Serverless Framework (`npm install -g serverless`)

### Configuración AWS
1. Crear una cuenta AWS
2. Crear un usuario IAM con permisos:
   - AWSLambdaFullAccess
   - AmazonAPIGatewayAdministrator
   - AmazonDynamoDBFullAccess
   - IAMFullAccess
3. Configurar credenciales AWS:
```bash
aws configure
```

## Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd vuelos-api
```

2. Instalar dependencias:
```bash
npm install
```

3. Instalar plugins de Serverless:
```bash
npm install --save-dev serverless-offline
npm install --save-dev serverless-auto-swagger
npm install --save-dev serverless-swagger-ui
```

## Estructura del Proyecto
```
vuelos-api/
├── src
│   ├── config
│   │   └── auth.js
│   ├── controllers
│   ├── functions
│   │   ├── auth
│   │   │   ├── login.js
│   │   │   └── register.js
│   │   └── itinerario
│   │       ├── create.js
│   │       ├── get.js
│   │       └── list.js
│   ├── middlewares
│   │   ├── auth.js
│   │   └── validator.js
│   ├── models
│   │   ├── itinerario.js
│   │   └── user.js
│   ├── routes
│   └── types
│       └── itinerario.ts
├── swagger.yml
├── terraform
│   ├── README.md
│   └── main.tf
└── tests
├── package-lock.json
├── package.json
├── serverless.yml
└── package.json
```

## Configuración

### Variables de Entorno
Crear archivo `.env`:
```env
DYNAMODB_TABLE=itinerarios-table
JWT_SECRET=your-secret-key
STAGE=dev
```

### Configuración de Serverless
El archivo `serverless.yml` ya contiene la configuración necesaria para:
- Funciones Lambda
- API Gateway
- DynamoDB
- Swagger UI
- Autorización JWT

## Despliegue

### Desarrollo Local
```bash
# Iniciar servidor local
serverless offline start --stage dev

# La API estará disponible en:
# - API: http://localhost:3000/dev
# - Swagger JSON: http://localhost:3000/dev/swagger
# - Swagger UI: http://localhost:3000/dev/swagger-ui
```

### Producción
```bash
# Desplegar en AWS
serverless deploy

# Desplegar una función específica
serverless deploy function -f functionName 
    or
serverless deploy --stage prod 
```


## Documentación API

La documentación de la API está disponible en:
- Desarrollo: https://7nwl8wu7x7.execute-api.us-east-1.amazonaws.com/dev/dev/swagger
- Producción: https://gwfe99mkm9.execute-api.us-east-1.amazonaws.com/prod/prod/swagger

## Documentación Pruebas

- Documentación  https://documenter.getpostman.com/view/2045817/2sAYJAeHjx


### Terraform

Crear archivo `main.tf`:
```hcl
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

```

Desplegar con Terraform:
```bash
terraform -chdir=terraform init
terraform -chdir=terraform plan
terraform -chdir=terraform apply
```

### Scripts de CI/CD

#### GitHub Actions
Crear `.github/workflows/deploy.yml`:
```yaml
name: Deploy to AWS

on:
  push:
    branches:
      - master

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      # 1. Checkout el repositorio
      - name: Checkout code
        uses: actions/checkout@v3

      # 2. Configurar las credenciales de AWS
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v3
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      # 3. Instalar Terraform
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.5.0

      # 4. Inicializar Terraform
      - name: Terraform Init
        run: cd terraform && terraform init

      # 5. Aplicar Terraform
      - name: Terraform Apply
        run: cd terraform && terraform apply -auto-approve

      # 6. Instalar dependencias del proyecto Serverless
      - name: Install dependencies
        run: cd serverless && npm install

      # 7. Desplegar con Serverless
      - name: Deploy Serverless
        run: cd serverless && npx serverless deploy --stage prod

```



## Licencia
Este proyecto está bajo la Licencia MIT.
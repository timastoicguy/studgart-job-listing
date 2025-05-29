cd "../main"

## Terraform Backend Configuration
export TFSTATE_RG_NAME="job-listing-tfstate-rg"
export TFSTATE_STORAGE_ACCOUNT_NAME="studgarttfstate"
export TFSTATE_CONTAINER_NAME="tfstate"
export TFSTATE_KEY="dev.tfstate"

## Azuere Subscription ID is required
export ARM_SUBSCRIPTION_ID=7d67acf6-4ec1-42ba-8d14-c091b698b305

terraform init \
  -backend-config="resource_group_name=${TFSTATE_RG_NAME}" \
  -backend-config="storage_account_name=${TFSTATE_STORAGE_ACCOUNT_NAME}" \
  -backend-config="container_name=${TFSTATE_CONTAINER_NAME}" \
  -backend-config="key=${TFSTATE_KEY}"

## Destroy script
terraform plan \
  -out destroy.plan \
  -target="module.acr" \
  -target="module.network" \
  -target="module.aks" \
  -target="module.aks_cert_manager" \
  -target="module.aks_cluster_issuer" \
  -destroy
terraform apply destroy.plan

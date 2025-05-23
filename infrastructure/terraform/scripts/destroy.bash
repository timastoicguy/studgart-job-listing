## Terraform Backend Configuration
# export TFSTATE_RG_NAME=""
# export TFSTATE_STORAGE_ACCOUNT_NAME=""
# export TFSTATE_CONTAINER_NAME=""
# export TFSTATE_KEY=""

## Azuere Subscription ID is required
# export ARM_SUBSCRIPTION_ID=""

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
  -target="module.aks_traefik_gateway" \
  -target="module.aks_cluster_issuer" \
  -destroy
terraform apply destroy.plan

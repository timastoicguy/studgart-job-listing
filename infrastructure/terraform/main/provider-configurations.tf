## PROVIDER CONFIG
provider "azurerm" {
  features {}
  use_oidc = true
}
provider "kubernetes" {
  host                   = module.aks.kubeconfig.host
  client_certificate     = module.aks.kubeconfig.client_certificate
  client_key             = module.aks.kubeconfig.client_key
  cluster_ca_certificate = module.aks.kubeconfig.cluster_ca_certificate
}
provider "helm" {
  kubernetes {
    host                   = module.aks.kubeconfig.host
    client_certificate     = module.aks.kubeconfig.client_certificate
    client_key             = module.aks.kubeconfig.client_key
    cluster_ca_certificate = module.aks.kubeconfig.cluster_ca_certificate
  }
}

## TERRAFORM BACKEND CONFIG
terraform {
  backend "azurerm" {}
}

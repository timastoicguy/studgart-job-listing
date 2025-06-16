module "aks_cluster_issuer" {
  source          = "../modules/aks-cluster-issuer"
  subscription_id = var.subscription_id
  rg_name         = azurerm_resource_group.rg.name
  dns_zone_name   = module.dns.studgart.name
}

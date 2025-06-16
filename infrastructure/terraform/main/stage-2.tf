module "aks_cert_manager" {
  source = "../modules/aks-cert-manager"
}

module "aks_traefik_gateway" {
  source        = "../modules/aks-traefik-gateway"
  rg_name       = azurerm_resource_group.rg.name
  location      = var.location
  dns_zone_name = module.dns.studgart.name
  aks_name      = module.aks.aks.name
}

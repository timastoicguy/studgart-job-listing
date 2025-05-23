resource "azurerm_resource_group" "rg" {
  name     = "job-listing-rg"
  location = var.location
  tags     = var.default_tags
  lifecycle {
    prevent_destroy = true
  }
}

module "storage_account" {
  source       = "../modules/storage-account"
  rg_name      = azurerm_resource_group.rg.name
  location     = var.location
  default_tags = var.default_tags
}

module "acr" {
  source        = "../modules/acr"
  rg_name       = azurerm_resource_group.rg.name
  location      = var.location
  sku           = "Basic"
  admin_enabled = false
  tags          = var.default_tags
}

module "network" {
  source   = "../modules/network"
  prefix   = var.prefix
  location = var.location
  rg_name  = azurerm_resource_group.rg.name
  tags     = var.default_tags
}

module "dns" {
  source   = "../modules/dns"
  prefix   = var.prefix
  rg_name  = azurerm_resource_group.rg.name
  location = var.location
  tags     = var.default_tags
}

module "aks" {
  source            = "../modules/aks"
  prefix            = var.prefix
  location          = var.location
  rg_name           = azurerm_resource_group.rg.name
  tags              = var.default_tags
  vm_size           = "Standard_D2s_v3"
  syspool_min_count = 1
  syspool_max_count = 1
  vnet_id           = module.network.vnet.id
  aks_subnet_id     = module.network.aks_subnet.id
  acr_id            = module.acr.acr.id
}

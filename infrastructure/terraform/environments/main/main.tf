resource "azurerm_resource_group" "rg" {
  name     = "job-listing-rg"
  location = var.location
  tags     = var.default_tags
  lifecycle {
    prevent_destroy = true
  }
}

module "storage_account" {
  source       = "../../modules/storage-account"
  rg_name      = azurerm_resource_group.rg.name
  location     = var.location
  default_tags = var.default_tags
  depends_on   = [azurerm_resource_group.rg]
}

module "acr" {
  source        = "../../modules/acr"
  prefix        = var.prefix
  rg_name       = azurerm_resource_group.rg.name
  location      = var.location
  sku           = "Basic"
  admin_enabled = false
  tags          = var.default_tags
  depends_on    = [azurerm_resource_group.rg]
}

module "network" {
  source   = "../../modules/network"
  prefix   = var.prefix
  location = var.location
  rg_name  = azurerm_resource_group.rg.name
  tags     = var.default_tags
}

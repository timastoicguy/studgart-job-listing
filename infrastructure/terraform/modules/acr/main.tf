resource "random_string" "acr_name" {
  length  = 16
  special = false
}

resource "azurerm_container_registry" "acr" {
  name                = "${random_string.acr_name.result}"
  resource_group_name = var.rg_name
  location            = var.location
  sku                 = var.sku
  admin_enabled       = var.admin_enabled
  tags                = var.tags
}

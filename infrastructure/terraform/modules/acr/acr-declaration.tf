resource "azurerm_container_registry" "acr" {
  name                = "${var.prefix}acr2025"
  resource_group_name = var.rg_name
  location            = var.location
  sku                 = var.sku
  admin_enabled       = var.admin_enabled
  tags                = var.tags
}

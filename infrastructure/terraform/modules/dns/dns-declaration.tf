resource "azurerm_dns_zone" "studgart" {
  name                = "studgart.com"
  resource_group_name = var.rg_name
  tags                = var.tags
}

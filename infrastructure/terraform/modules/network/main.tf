resource "azurerm_virtual_network" "vnet" {
  resource_group_name = var.rg_name
  name                = "${var.prefix}-vnet"
  location            = var.location
  address_space = [
    "10.0.0.0/8",
  ]
  tags = var.tags
}

resource "azurerm_subnet" "aks_subnet" {
  virtual_network_name = azurerm_virtual_network.vnet.name
  resource_group_name  = var.rg_name
  name                 = "${var.prefix}-akssubnet"
  address_prefixes = [
    "10.1.0.0/16",
  ]
  depends_on = [azurerm_virtual_network.vnet]
}

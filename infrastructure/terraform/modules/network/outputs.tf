output "vnet" {
  value = {
    name          = azurerm_virtual_network.vnet.name
    id            = azurerm_virtual_network.vnet.id
    address_space = azurerm_virtual_network.vnet.address_space
  }
}

output "aks_subnet" {
  value = {
    name           = azurerm_subnet.aks_subnet.name
    id             = azurerm_subnet.aks_subnet.id
    address_prefix = azurerm_subnet.aks_subnet.address_prefixes
  }
}

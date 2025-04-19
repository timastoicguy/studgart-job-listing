output "studgart" {
  value = {
    name = azurerm_dns_zone.studgart.name
    id   = azurerm_dns_zone.studgart.id
  }
}

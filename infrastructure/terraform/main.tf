resource "azurerm_resource_group" "rg" {
  name = "job-listing-rg"
  location = "southeastasia"
}

resource "azurerm_storage_account" "storage_account" {
  name = "joblisting2024a"
  resource_group_name = azurerm_resource_group.rg.name
  location = azurerm_resource_group.rg.location
  account_tier = "Standard"
  account_replication_type = "LRS"
  depends_on = [ azurerm_resource_group.rg ]
}

resource "azurerm_storage_container" "storage_container" {
  name = "default"
  storage_account_name = azurerm_storage_account.storage_account.name
  container_access_type = "container"
  depends_on = [ azurerm_storage_account.storage_account ]
}
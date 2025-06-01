resource "azurerm_storage_account" "storage_account" {
  name                     = "joblisting2024a"
  resource_group_name      = var.rg_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  tags                     = var.default_tags
  blob_properties {
    cors_rule {
      allowed_origins = [ "*" ]
      allowed_headers = [ "*" ]
      allowed_methods = [ "GET", "PUT", "POST", "DELETE", "PATCH" ]
      exposed_headers = [ "*" ]
      max_age_in_seconds = 3600
    }
  }
  lifecycle {
    prevent_destroy = true
  }
}

resource "azurerm_storage_container" "storage_container" {
  name                  = "default"
  storage_account_id    = azurerm_storage_account.storage_account.id
  container_access_type = "container"
  depends_on            = [azurerm_storage_account.storage_account]
  lifecycle {
    prevent_destroy = true
  }
}

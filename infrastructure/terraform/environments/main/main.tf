resource "azurerm_resource_group" "rg" {
  name     = "job-listing-rg"
  location = "southeastasia"
  tags     = var.default_tags
  lifecycle {
    prevent_destroy = true
  }
}

module "storage_account" {
  source       = "../../modules/storage-account"
  rg_name      = azurerm_resource_group.rg.name
  location     = "southeastasia"
  default_tags = var.default_tags
  depends_on   = [azurerm_resource_group.rg]
}

resource "azurerm_resource_group" "rg" {
  name     = "job-listing-rg"
  location = "southeastasia"
}

resource "azurerm_storage_account" "storage_account" {
  name                     = "joblisting2024a"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  depends_on               = [azurerm_resource_group.rg]
}

resource "azurerm_storage_container" "storage_container" {
  name                  = "default"
  storage_account_name  = azurerm_storage_account.storage_account.name
  container_access_type = "container"
  depends_on            = [azurerm_storage_account.storage_account]
}

resource "azurerm_service_plan" "service_plan" {
  name                = "job-listing-service-plan"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "B1"
  depends_on          = [azurerm_resource_group.rg]
}

resource "azurerm_linux_web_app" "backend" {
  depends_on          = [azurerm_service_plan.service_plan]
  name                = "backend-studgart"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.service_plan.id

  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE" = "1"
  }

  site_config {
    application_stack {
      node_version = "20-lts"
    }
    cors {
      allowed_origins = ["*"]
    }
  }

  logs {
    application_logs {
      file_system_level = "Verbose"
    }
  }
}

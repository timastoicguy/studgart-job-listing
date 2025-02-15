provider "azurerm" {
  features {}
  subscription_id = "7d67acf6-4ec1-42ba-8d14-c091b698b305"
}

terraform {
  backend "azurerm" {
    resource_group_name  = "job-listing-tfstate-rg"
    storage_account_name = "studgarttfstate"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"

  }
}

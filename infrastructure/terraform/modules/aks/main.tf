// AKS CLUSTER
resource "azurerm_kubernetes_cluster" "aks" {
  resource_group_name = var.rg_name
  name                = "${var.prefix}-aks"
  location            = var.location
  dns_prefix          = var.prefix
  default_node_pool {
    vnet_subnet_id              = var.aks_subnet_id
    vm_size                     = var.vm_size
    name                        = "default"
    min_count                   = var.syspool_min_count
    max_count                   = var.syspool_max_count
    temporary_name_for_rotation = "temppool"
    auto_scaling_enabled        = true
    upgrade_settings {
      max_surge = "1"
    }
  }

  identity {
    type = "SystemAssigned"
  }

  lifecycle {
    ignore_changes = [
      default_node_pool
    ]
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
  }
  tags = var.tags
}

// AGENT POOL IDENTITY CREATED BY AKS
data "azurerm_user_assigned_identity" "agentpool_identity" {
  depends_on          = [azurerm_kubernetes_cluster.aks]
  name                = "${azurerm_kubernetes_cluster.aks.name}-agentpool"
  resource_group_name = "MC_${var.rg_name}_${azurerm_kubernetes_cluster.aks.name}_${var.location}"
}

// ASSIGN PERMISSIONS TO AGENT POOL IDENTITY
resource "azurerm_role_assignment" "role_acr_pull" {
  scope                = var.acr_id
  role_definition_name = "AcrPull"
  principal_id         = data.azurerm_user_assigned_identity.agentpool_identity.principal_id
}

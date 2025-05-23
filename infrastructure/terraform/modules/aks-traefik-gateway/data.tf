data "azurerm_kubernetes_cluster" "aks" {
  name                = var.aks_name
  resource_group_name = var.rg_name
}

data "azurerm_resource_group" "MC_group" {
  name = "MC_${var.rg_name}_${var.aks_name}_${var.location}"
}

data "azurerm_user_assigned_identity" "agent_pool_identity" {
  name                = "${var.aks_name}-agentpool"
  resource_group_name = data.azurerm_resource_group.MC_group.name
  depends_on          = [data.azurerm_resource_group.MC_group]
}

data "azurerm_dns_zone" "studgart" {
  name                = var.dns_zone_name
  resource_group_name = var.rg_name
}

data "kubernetes_service" "traefik" {
  metadata {
    name      = "traefik"
    namespace = "traefik"
  }
  depends_on = [ helm_release.traefik ]
}

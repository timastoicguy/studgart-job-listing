data "azurerm_resource_group" "MC_group" {
  name       = "MC_${var.rg_name}_${azurerm_kubernetes_cluster.aks.name}_${azurerm_kubernetes_cluster.aks.location}"
  depends_on = [azurerm_kubernetes_cluster.aks]
}

data "azurerm_user_assigned_identity" "agent_pool_identity" {
  name                = "${azurerm_kubernetes_cluster.aks.name}-agentpool"
  resource_group_name = data.azurerm_resource_group.MC_group.name
  depends_on          = [data.azurerm_resource_group.MC_group]
}

data "azurerm_dns_zone" "studgart" {
  name                = "studgart.com"
  resource_group_name = var.rg_name
}

data "kubernetes_service" "traefik" {
  metadata {
    name      = "traefik"
    namespace = "traefik"
  }
  depends_on = [helm_release.traefik]
}

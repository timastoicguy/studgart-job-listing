output "aks" {
  value = {
    name = azurerm_kubernetes_cluster.aks.name
    id   = azurerm_kubernetes_cluster.aks.id
  }
}

output "kubeconfig" {
  value = {
    host                   = azurerm_kubernetes_cluster.aks.kube_config.0.host
    client_certificate     = base64decode(azurerm_kubernetes_cluster.aks.kube_config.0.client_certificate)
    client_key             = base64decode(azurerm_kubernetes_cluster.aks.kube_config.0.client_key)
    cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.aks.kube_config.0.cluster_ca_certificate)
  }
  description = "kubeconfig for kubectl access."
  sensitive   = true
}

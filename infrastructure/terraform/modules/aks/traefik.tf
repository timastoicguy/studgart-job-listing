resource "helm_release" "traefik" {
  name             = "traefik"
  repository       = "https://helm.traefik.io/traefik"
  chart            = "traefik"
  version          = "10.0.0"
  namespace        = "traefik"
  create_namespace = true

  ## Set the values for the Helm chart
  set {
    name  = "providers.kubernetesIngress.enabled"
    value = "false"
  }
  set {
    name  = "providers.kubernetesGateway.enabled"
    value = "true"
  }
  set {
    name  = "gateway.namespacePolicy"
    value = "All"
  }
  depends_on = [azurerm_kubernetes_cluster.aks]
}

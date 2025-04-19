resource "helm_release" "traefik" {
  name       = "traefik"
  repository = "https://traefik.github.io/charts"
  chart      = "traefik"
  # version          = "0.29.1"
  namespace        = "traefik"
  create_namespace = true

  values = [
    "${file("${path.module}/traefik-gateway-values.yml")}"
  ]

  depends_on = [azurerm_kubernetes_cluster.aks]
}

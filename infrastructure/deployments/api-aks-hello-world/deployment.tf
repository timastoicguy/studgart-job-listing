resource "helm_release" "api_aks_hello_world" {
  name             = "api-aks-hello-world"
  namespace        = "api-aks-hello-world"
  create_namespace = true
  chart            = "../../helm-charts/api-aks-hello-world"
  values = [
    "${file("../../helm-charts/api-aks-hello-world/values.yaml")}"
  ]
}

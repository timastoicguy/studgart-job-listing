resource "helm_release" "aks_hello_world" {
  name             = "aks-hello-world"
  namespace        = "aks-hello-world"
  create_namespace = true
  chart            = "../../../helm-charts/aks-hello-world"
}

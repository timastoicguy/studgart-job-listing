resource "helm_release" "cert_manager" {
  name             = "cert-manager"
  repository       = "https://charts.jetstack.io"
  chart            = "cert-manager"
  version          = "v1.17.0"
  namespace        = "cert-manager"
  create_namespace = true
  values = [
    <<-EOT
      crds:
        enabled: true
      config:
        apiVersion: controller.config.cert-manager.io/v1alpha1
        kind: ControllerConfiguration
        enableGatewayAPI: true
    EOT
  ]
}

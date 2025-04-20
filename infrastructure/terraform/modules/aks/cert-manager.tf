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
  depends_on = [azurerm_kubernetes_cluster.aks]
}

resource "kubernetes_manifest" "cluster_issuer" {
  manifest = {
    apiVersion = "cert-manager.io/v1"
    kind       = "ClusterIssuer"
    metadata = {
      name = "letsencrypt"
    }
    spec = {
      acme = {
        email  = "khangthinh2401@gmail.com"
        server = "https://acme-v02.api.letsencrypt.org/directory"
        privateKeySecretRef = {
          name = "cluster-issuer-account-key"
        }
        solvers = [
          {
            dns01 = {
              azureDNS = {
                subscriptionID    = var.subscription_id
                resourceGroupName = var.rg_name
                hostedZoneName    = var.dns_zone_name
                environment       = "AzurePublicCloud"
              }
            }
          }
        ]
      }
    }
  }
  depends_on = [helm_release.cert_manager]
}

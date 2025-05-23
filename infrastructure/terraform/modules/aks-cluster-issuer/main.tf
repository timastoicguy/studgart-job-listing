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
}

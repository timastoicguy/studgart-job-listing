resource "helm_release" "traefik" {
  name       = "traefik"
  repository = "https://traefik.github.io/charts"
  chart      = "traefik"
  # version          = "0.29.1"
  namespace        = "traefik"
  create_namespace = true
  values = [
    <<-EOT
      providers:
        kubernetesIngress:
          enabled: false
        kubernetesGateway:
          enabled: true
      gateway:
        annotations:
          cert-manager.io/cluster-issuer: letsencrypt
        listeners:
          web:
            port: 8000
            namespacePolicy: All
            protocol: HTTP
          websecure:
            port: 8443
            namespacePolicy: All
            protocol: HTTPS
            mode: Terminate
            hostname: studgart.com
            certificateRefs:
              - name: studgart-com-tls
          apisecure:
            port: 8443
            namespacePolicy: All
            protocol: HTTPS
            mode: Terminate
            hostname: api.studgart.com
            certificateRefs:
              - name: api-studgart-com-tls
    EOT
  ]
  depends_on = [azurerm_kubernetes_cluster.aks, kubernetes_manifest.cluster_issuer]
}

resource "helm_release" "frontend" {
  name             = "frontend"
  namespace        = "frontend"
  create_namespace = true
  chart            = "../../helm-charts/frontend"
  values = [
    <<-EOT
      image:
        tag: ${var.image_tag}
    EOT 
  ]
}

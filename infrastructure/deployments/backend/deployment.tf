resource "helm_release" "backend" {
  name             = "backend"
  namespace        = "backend"
  create_namespace = true
  chart            = "../../helm-charts/backend"
  values = [
    <<-EOT
      image:
        tag: ${var.image_tag}
    EOT
  ]
}

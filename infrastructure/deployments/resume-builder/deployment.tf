resource "helm_release" "resume_builder" {
  name             = "resume-builder"
  namespace        = "resume-builder"
  create_namespace = true
  chart            = "../../helm-charts/resume-builder"
  values = [
    <<-EOT
      image:
        tag: ${var.image_tag}
    EOT 
  ]
}

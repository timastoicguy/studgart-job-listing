resource "azurerm_dns_a_record" "frontend" {
  name                = "@"
  zone_name           = data.azurerm_dns_zone.studgart.name
  resource_group_name = data.azurerm_dns_zone.studgart.resource_group_name
  ttl                 = 3600
  records             = [data.kubernetes_service.traefik.status[0].load_balancer[0].ingress[0].ip]
}

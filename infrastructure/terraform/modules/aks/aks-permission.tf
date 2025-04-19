resource "azurerm_role_assignment" "acr_pull" {
  scope                = var.acr_id
  role_definition_name = "AcrPull"
  principal_id         = data.azurerm_user_assigned_identity.agent_pool_identity.principal_id
}
resource "azurerm_role_assignment" "dns_contributor" {
  scope                            = data.azurerm_dns_zone.studgart.id
  role_definition_name             = "DNS Zone Contributor"
  principal_id                     = data.azurerm_user_assigned_identity.agent_pool_identity.principal_id
  skip_service_principal_aad_check = true
}

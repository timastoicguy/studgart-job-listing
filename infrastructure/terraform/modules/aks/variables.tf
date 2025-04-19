// GENERAL VARIABLES ---------------------------------------
variable "prefix" { type = string }
variable "location" { type = string }
variable "rg_name" { type = string }
variable "tags" { type = map(string) }

// AKS VARIABLES -------------------------------------------
variable "vm_size" { type = string }
variable "syspool_min_count" { type = string }
variable "syspool_max_count" { type = string }

// NETWORK -------------------------------------------------
variable "vnet_id" { type = string }
variable "aks_subnet_id" { type = string }

// ACR
variable "acr_id" { type = string }

// CERT MANAGER VARIABLES ---------------------------------
variable "subscription_id" { type = string }
variable "dns_zone_name" { type = string }

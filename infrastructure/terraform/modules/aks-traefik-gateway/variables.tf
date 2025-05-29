// GENERAL VARIABLES ---------------------------------------
variable "rg_name" { type = string }
variable "location" { type = string }

// CERT MANAGER VARIABLES ---------------------------------
variable "dns_zone_name" { type = string }
variable "aks_name" { type = string }

// GENERAL VARIABLES ---------------------------------------
variable "prefix" { type = string }
variable "location" { type = string }
variable "rg_name" { type = string }
variable "tags" { type = map(string) }

// ACR VARIABLES -------------------------------------------
variable "sku" { type = string }
variable "admin_enabled" { type = bool }

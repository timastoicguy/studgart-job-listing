variable "rg_name" {
  description = "The name of the resource group"
  type        = string
}

variable "location" {
  description = "The location of the resource group"
  type        = string
}

variable "default_tags" {
  description = "The default tags for the resource group"
  type        = map(string)
}

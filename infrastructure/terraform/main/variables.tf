variable "default_tags" {
  description = "The default tags for the resource group"
  type        = map(string)
  default = {
    "CREATED_BY" = "terraform"
  }
}

variable "location" {
  description = "The location of the resource group"
  type        = string
  default     = "southeastasia"
}

variable "prefix" {
  description = "The prefix for the resource group"
  type        = string
  default     = "job-listing"
}

variable "subscription_id" {
  description = "The subscription ID for the Azure resources"
  type        = string
}
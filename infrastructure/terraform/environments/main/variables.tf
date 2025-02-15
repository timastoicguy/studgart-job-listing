variable "default_tags" {
  description = "The default tags for the resource group"
  type        = map(string)
  default = {
    "CREATED_BY" = "terraform"
  }
}

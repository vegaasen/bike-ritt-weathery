resource "aws_route53_zone" "site" {
  name = var.domain_name

  tags = {
    Name = "${var.domain_name}-zone"
  }
}
